"""
TopicIndexer — expands the PMCDataRetriever index when new body part
topics are detected in a user message. Anything in here like "knee" or "neck" that isn't already indexed will trigger a search
for relevant PMC articles, which are then embedded and added to the index on demand.
This way we can keep the index focused and efficient, only adding articles when the user shows interest in a specific topic.
The mapping of keywords to search queries is defined in TOPIC_QUERIES, which can be easily extended with more topics as needed.
"""

from typing import Optional
from classes.PMCDataRetriever import PMCDataRetriever


# Maps a keyword (checked against the user message) to a PMC search query
TOPIC_QUERIES: dict[str, str] = {
    "neck":      "neck pain cervical rehabilitation",
    "knee":      "knee pain physiotherapy exercises",
    "hip":       "hip mobility rehabilitation stretches",
    "ankle":     "ankle sprain recovery exercises",
    "wrist":     "wrist pain rehabilitation exercises",
    "elbow":     "elbow tendonitis physiotherapy",
    "sciatica":  "sciatica nerve pain treatment",
    "posture":   "posture correction exercises",
    "hamstring": "hamstring strain rehabilitation",
    "calf":      "calf muscle strain physiotherapy",
}


class TopicIndexer:
    """
    Detects unindexed topics in a user message and fetches + embeds
    the relevant PMC articles on demand, then persists the updated index.
    """

    def __init__(
        self,
        retriever: PMCDataRetriever,
        index_path: str,
        seeded_topics: Optional[set[str]] = None,
    ):
        """
        Args:
            retriever:      The shared PMCDataRetriever instance.
            index_path:     Path to the JSON index file (for persistence).
            seeded_topics:  Topics already present in the index at startup.
        """
        self._retriever  = retriever
        self._index_path = index_path
        # Start from any explicitly seeded topics, then scan existing chunks
        # so topics loaded from a saved index are not re-fetched
        self._indexed: set[str] = seeded_topics or set()
        self._indexed |= self._detect_indexed_topics()

    def _detect_indexed_topics(self) -> set[str]:
        """
        Scan the existing chunk texts to infer which topics are already indexed.
        Avoids re-fetching articles that were loaded from a saved index file.
        """
        if not self._retriever.chunk_count:
            return set()

        all_text = " ".join(c.text.lower() for c in self._retriever._chunks)
        return {topic for topic in TOPIC_QUERIES if topic in all_text}

    def ensure_indexed(self, message: str) -> int:
        """
        Check the message for any topic keywords not yet in the index.
        Fetches, embeds, and persists articles for any new topics found.

        Returns the total number of new chunks added.
        """
        msg_lower = message.lower()
        added = 0

        for topic, query in TOPIC_QUERIES.items():
            if topic not in self._indexed and topic in msg_lower:
                print(f"[TopicIndexer] New topic detected: '{topic}' — fetching PMC articles for: '{query}'")
                added += self._retriever.search_and_index(query, max_articles=20)
                self._indexed.add(topic)

        if added:
            print(f"[TopicIndexer] Indexed {added} new chunks — saving index to '{self._index_path}'")
            self._retriever.save_index(self._index_path)

        return added

    @property
    def indexed_topics(self) -> set[str]:
        """Read-only view of all topics currently in the index."""
        return frozenset(self._indexed)
