
"""
PMCDataRetriever — RAG helper for physiotherapy articles from PubMed Central.

Flow:
  1. search()        — query PMC for article IDs via NCBI E-utilities (free, no key required)
  2. fetch()         — download titles + abstracts for those IDs
  3. index()         — chunk text and embed with OpenAI text-embedding-3-small
  4. retrieve()      — cosine-similarity lookup for a user query
  5. build_context() — returns a ready-to-inject string for an LLM prompt

Persistence:
  Call save_index(path) / load_index(path) to avoid re-embedding on every start-up.

Usage example:
    retriever = PMCDataRetriever(openai_client)
    retriever.search_and_index("rotator cuff rehabilitation exercises", max_articles=20)
    context = retriever.build_context("What stretches help with shoulder impingement?")
    # inject `context` into your OpenAI system prompt
"""

import json
import math
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class ArticleChunk:
    """A single text chunk derived from a PMC article."""
    pmcid: str
    title: str
    chunk_index: int
    text: str
    embedding: list[float] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _cosine_similarity(a: list[float], b: list[float]) -> float:
    dot    = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def _chunk_text(text: str, max_tokens: int = 400, overlap_words: int = 50) -> list[str]:
    """
    Word-level sliding-window chunker.
    ~1.3 words per token on average  →  400 tokens ≈ 300 words.
    """
    words      = text.split()
    chunk_size = int(max_tokens / 1.3)
    chunks: list[str] = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunks.append(" ".join(words[start:end]))
        start += chunk_size - overlap_words
    return [c for c in chunks if c.strip()]


# ---------------------------------------------------------------------------
# Main class
# ---------------------------------------------------------------------------

class PMCDataRetriever:
    """
    Retrieval-Augmented Generation helper for PubMed Central physiotherapy articles.

    Only the standard library + openai SDK are required — no extra vector DB needed.
    """

    ESEARCH_URL     = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    EFETCH_URL      = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
    EMBEDDING_MODEL = "text-embedding-3-small"

    # NCBI rate limit: 3 req/s without API key, 10 req/s with one
    _REQUEST_DELAY = 0.34  # seconds between NCBI HTTP calls

    def __init__(self, openai_client, ncbi_api_key: Optional[str] = None):
        """
        Args:
            openai_client:  An initialised openai.OpenAI client (reuse the one in app.py).
            ncbi_api_key:   Optional NCBI API key — raises the rate limit to 10 req/s.
                            Set NCBI_API_KEY in your .env and pass os.environ.get("NCBI_API_KEY").
        """
        self._client       = openai_client
        self._ncbi_api_key = ncbi_api_key
        self._chunks: list[ArticleChunk] = []

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def search_and_index(
        self,
        query: str,
        max_articles: int = 20,
        physiotherapy_filter: bool = True,
    ) -> int:
        """
        Convenience wrapper: search → fetch → embed → index.

        Returns the number of new chunks added to the index.
        """
        ids = self.search(query, max_results=max_articles, physiotherapy_filter=physiotherapy_filter)
        if not ids:
            return 0
        articles = self.fetch(ids)
        return self.index(articles)

    def search(
        self,
        query: str,
        max_results: int = 20,
        physiotherapy_filter: bool = True,
    ) -> list[str]:
        """
        Search PubMed Central for article IDs using the NCBI E-utilities esearch endpoint.

        Args:
            query:                 Free-text search term.
            max_results:           Maximum number of PMCIDs to return.
            physiotherapy_filter:  Append physiotherapy/rehabilitation MeSH terms automatically.

        Returns:
            List of PMCID strings, e.g. ["PMC1234567", "PMC9876543"].
        """
        if physiotherapy_filter:
            query = (
                f"({query}) AND "
                "(physiotherapy[MeSH] OR \"physical therapy\"[MeSH] OR rehabilitation[MeSH])"
            )

        params: dict = {
            "db":         "pmc",
            "term":       query,
            "retmax":     str(max_results),
            "retmode":    "json",
            "usehistory": "n",
        }
        if self._ncbi_api_key:
            params["api_key"] = self._ncbi_api_key

        url  = f"{self.ESEARCH_URL}?{urllib.parse.urlencode(params)}"
        data = json.loads(self._ncbi_get(url))

        ids: list[str] = data.get("esearchresult", {}).get("idlist", [])
        # Normalise — IDs sometimes arrive as bare integers
        return [f"PMC{i}" if not str(i).startswith("PMC") else str(i) for i in ids]

    def fetch(self, pmcids: list[str]) -> list[dict]:
        """
        Fetch article metadata (title + abstract) for a list of PMCIDs via efetch.

        Returns:
            List of dicts: [{"pmcid": str, "title": str, "abstract": str}, ...]
        """
        bare_ids = ",".join(i.replace("PMC", "") for i in pmcids)

        params: dict = {
            "db":      "pmc",
            "id":      bare_ids,
            "rettype": "xml",
            "retmode": "xml",
        }
        if self._ncbi_api_key:
            params["api_key"] = self._ncbi_api_key

        url      = f"{self.EFETCH_URL}?{urllib.parse.urlencode(params)}"
        xml_text = self._ncbi_get(url)
        return self._parse_articles_xml(xml_text)

    def index(self, articles: list[dict]) -> int:
        """
        Chunk articles, embed each chunk with OpenAI, and add to the in-memory index.
        Already-indexed PMCIDs are skipped automatically.

        Returns the number of new chunks added.
        """
        existing_ids = {c.pmcid for c in self._chunks}
        new_chunks: list[ArticleChunk] = []

        for article in articles:
            pmcid = article.get("pmcid", "unknown")
            if pmcid in existing_ids:
                continue

            full_text = f"{article.get('title', '')}. {article.get('abstract', '')}".strip(". ")
            if not full_text:
                continue

            for idx, chunk_text in enumerate(_chunk_text(full_text)):
                new_chunks.append(
                    ArticleChunk(
                        pmcid=       pmcid,
                        title=       article.get("title", ""),
                        chunk_index= idx,
                        text=        chunk_text,
                    )
                )

        if not new_chunks:
            return 0

        # Embed in batches of 100 (safe below the API's per-request limit)
        for batch_start in range(0, len(new_chunks), 100):
            batch = new_chunks[batch_start : batch_start + 100]
            response = self._client.embeddings.create(
                model=self.EMBEDDING_MODEL,
                input=[c.text for c in batch],
            )
            for chunk, emb_obj in zip(batch, response.data):
                chunk.embedding = emb_obj.embedding

        self._chunks.extend(new_chunks)
        return len(new_chunks)

    def retrieve(self, query: str, top_k: int = 5) -> list[ArticleChunk]:
        """
        Return the top-k most relevant chunks for a natural-language query.
        """
        if not self._chunks:
            return []

        query_embedding = self._client.embeddings.create(
            model=self.EMBEDDING_MODEL,
            input=[query],
        ).data[0].embedding

        scored = [
            (chunk, _cosine_similarity(query_embedding, chunk.embedding))
            for chunk in self._chunks
            if chunk.embedding
        ]
        scored.sort(key=lambda x: x[1], reverse=True)
        return [chunk for chunk, _ in scored[:top_k]]

    def build_context(
        self,
        query: str,
        top_k: int = 5,
        header: str = "Relevant physiotherapy research from PubMed Central:",
    ) -> str:
        """
        Retrieve the most relevant chunks and format them as a context block
        ready to be prepended to an OpenAI system prompt.

        Returns an empty string when the index is empty.
        """
        chunks = self.retrieve(query, top_k=top_k)
        if not chunks:
            return ""

        lines = [header, ""]
        for i, chunk in enumerate(chunks, 1):
            lines.append(f"[{i}] {chunk.title} (PMCID: {chunk.pmcid})")
            lines.append(chunk.text)
            lines.append("")

        return "\n".join(lines).strip()

    # ------------------------------------------------------------------
    # Persistence — avoid re-embedding on every server restart
    # ------------------------------------------------------------------

    def save_index(self, path: str) -> None:
        """Serialise the in-memory vector index to a JSON file."""
        data = [
            {
                "pmcid":       c.pmcid,
                "title":       c.title,
                "chunk_index": c.chunk_index,
                "text":        c.text,
                "embedding":   c.embedding,
            }
            for c in self._chunks
        ]
        Path(path).write_text(json.dumps(data, indent=2), encoding="utf-8")

    def load_index(self, path: str) -> int:
        """
        Load a previously saved index from disk and merge it with any existing chunks
        (deduplicates by PMCID).

        Returns the number of chunks loaded.
        """
        raw = json.loads(Path(path).read_text(encoding="utf-8"))
        existing_ids = {c.pmcid for c in self._chunks}
        loaded = 0
        for item in raw:
            if item["pmcid"] not in existing_ids:
                self._chunks.append(
                    ArticleChunk(
                        pmcid=       item["pmcid"],
                        title=       item["title"],
                        chunk_index= item["chunk_index"],
                        text=        item["text"],
                        embedding=   item["embedding"],
                    )
                )
                loaded += 1
        return loaded

    @property
    def chunk_count(self) -> int:
        """Number of chunks currently held in the in-memory index."""
        return len(self._chunks)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _ncbi_get(self, url: str) -> str:
        """HTTP GET to NCBI, respecting the per-second rate limit."""
        time.sleep(self._REQUEST_DELAY)
        with urllib.request.urlopen(url, timeout=15) as resp:
            return resp.read().decode("utf-8")

    def _parse_articles_xml(self, xml_text: str) -> list[dict]:
        """
        Parse an NCBI efetch XML payload into a list of article dicts.
        Handles both PubmedArticleSet (abstract-only) and pmc-articleset (full-text) formats.
        """
        articles: list[dict] = []

        try:
            root = ET.fromstring(xml_text)
        except ET.ParseError:
            return articles

        article_nodes = root.findall(".//PubmedArticle") or root.findall(".//article")

        for node in article_nodes:

            # --- PMCID (PubMed Central ID — the unique article identifier assigned by PMC) ---
            pmcid = ""
            # PubmedArticleSet format: <ArticleId IdType="pmc">...</ArticleId>
            for id_node in node.findall(".//ArticleId"):
                if id_node.get("IdType") == "pmc":
                    pmcid = f"PMC{id_node.text}"
                    break
            if not pmcid:
                # pmc-articleset format: <article-id pub-id-type="pmcid">PMC123</article-id>
                for id_node in node.findall(".//*[@pub-id-type='pmcid']"):
                    text = (id_node.text or "").strip()
                    if text:
                        pmcid = text if text.startswith("PMC") else f"PMC{text}"
                        break
            if not pmcid:
                # fallback: pub-id-type="pmc"
                for id_node in node.findall(".//*[@pub-id-type='pmc']"):
                    text = (id_node.text or "").strip()
                    if text:
                        pmcid = text if text.startswith("PMC") else f"PMC{text}"
                        break

            # --- Title ---
            title_node = node.find(".//ArticleTitle") or node.find(".//article-title")
            title = "".join(title_node.itertext()).strip() if title_node is not None else ""

            # --- Abstract (structured or plain) ---
            abstract_parts: list[str] = []
            for abs_node in node.findall(".//AbstractText"):
                label = abs_node.get("Label")
                text  = "".join(abs_node.itertext()).strip()
                abstract_parts.append(f"{label}: {text}" if label else text)

            # PMC full-text XML fallback
            if not abstract_parts:
                for p in node.findall(".//abstract//p"):
                    abstract_parts.append("".join(p.itertext()).strip())

            abstract = " ".join(abstract_parts)

            if title or abstract:
                articles.append(
                    {
                        "pmcid":    pmcid or "unknown",
                        "title":    title,
                        "abstract": abstract,
                    }
                )

        return articles
