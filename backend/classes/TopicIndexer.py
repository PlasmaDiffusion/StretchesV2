"""
TopicIndexer — dynamically expands the PMCDataRetriever index when new
physiotherapy topics are detected in a user message.

Rather than a hardcoded keyword→query map, a lightweight LLM call extracts
canonical topic names (e.g. "rotator cuff", "plantar fasciitis") from the
free-form user message, then constructs a PMC search query for each new topic.
Already-indexed topics are cached and persisted to avoid redundant API calls.
"""

import json
from pathlib import Path
from typing import Optional

from classes.PMCDataRetriever import PMCDataRetriever


_EXTRACT_SYSTEM_PROMPT = (
    "You are a physiotherapy triage assistant. "
    "Extract all distinct body parts or musculoskeletal conditions mentioned in the user's message. "
    "Return them as a JSON array of short lowercase strings, e.g. [\"rotator cuff\", \"knee\"]. "
    "If nothing relevant is found, return []. "
    "Return ONLY the JSON array, no other text."
)


class TopicIndexer:
    """
    Detects unindexed physiotherapy topics in a user message via LLM extraction,
    then fetches, embeds, and persists PMC articles for each new topic.
    """

    def __init__(
        self,
        retriever: PMCDataRetriever,
        openai_client,
        index_path: str,
        model: str = "gpt-4o-mini",
        seeded_topics: Optional[set[str]] = None,
    ):
        """
        Args:
            retriever:      The shared PMCDataRetriever instance.
            openai_client:  The shared OpenAI client (used for topic extraction).
            index_path:     Path to the JSON index file (for persistence).
            model:          Model used for topic extraction — should be cheap and fast.
            seeded_topics:  Topics to treat as already indexed (e.g. for testing).
        """
        self._retriever   = retriever
        self._client      = openai_client
        self._index_path  = index_path
        self._model       = model
        # Derived path for persisting the indexed topic set
        self._topics_path = str(Path(index_path).with_suffix("")) + ".topics.json"
        self._indexed: set[str] = seeded_topics or set()
        self._indexed |= self._load_indexed_topics()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def ensure_indexed(self, message: str) -> int:
        """
        Extract physiotherapy topics from the message and index any that are new.
        Fetches, embeds, and persists PMC articles for each new topic.

        Returns the total number of new chunks added.
        """
        topics = self._extract_topics(message)
        added = 0

        for topic in topics:
            if topic in self._indexed:
                continue
            query = f"{topic} rehabilitation physiotherapy exercises"
            print(f"[TopicIndexer] New topic detected: '{topic}' — fetching PMC articles for: '{query}'")
            added += self._retriever.search_and_index(query, max_articles=20)
            self._indexed.add(topic)

        if added:
            print(f"[TopicIndexer] Indexed {added} new chunks — saving index to '{self._index_path}'")
            self._retriever.save_index(self._index_path)
            self._save_indexed_topics()

        return added

    @property
    def indexed_topics(self) -> set[str]:
        """Read-only view of all topics currently in the index."""
        return frozenset(self._indexed)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _extract_topics(self, message: str) -> list[str]:
        """
        Use a lightweight LLM call to extract canonical physiotherapy topic names
        from the user message. Returns a list of lowercase strings.
        """
        response = self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": _EXTRACT_SYSTEM_PROMPT},
                {"role": "user",   "content": message},
            ],
            temperature=0,
            max_tokens=100,
        )
        raw = response.choices[0].message.content.strip()
        try:
            topics = json.loads(raw)
            return [t.lower().strip() for t in topics if isinstance(t, str) and t.strip()]
        except (json.JSONDecodeError, ValueError):
            print(f"[TopicIndexer] Failed to parse topic extraction response: {raw!r}")
            return []

    def _load_indexed_topics(self) -> set[str]:
        """Load the persisted set of already-indexed topic names from disk."""
        path = Path(self._topics_path)
        if not path.exists():
            return set()
        try:
            return set(json.loads(path.read_text(encoding="utf-8")))
        except (json.JSONDecodeError, ValueError):
            return set()

    def _save_indexed_topics(self) -> None:
        """Persist the current indexed topic set to disk."""
        Path(self._topics_path).write_text(
            json.dumps(sorted(self._indexed), indent=2), encoding="utf-8"
        )
