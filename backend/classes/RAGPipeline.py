"""
RAGPipeline — orchestrates the full RAG flow for physiotherapy advice.

Combines TopicIndexer (lazy topic fetching) and PMCDataRetriever (embedding + retrieval)
into a single fetch_context() call that app.py can use cleanly.
"""

from classes.PMCDataRetriever import PMCDataRetriever
from classes.TopicIndexer import TopicIndexer


class RAGPipeline:

    def __init__(self, retriever: PMCDataRetriever, topic_indexer: TopicIndexer):
        """
        Args:
            retriever:      The shared PMCDataRetriever instance.
            topic_indexer:  The shared TopicIndexer instance.
        """
        self._retriever     = retriever
        self._topic_indexer = topic_indexer

    def fetch_context(self, message: str) -> str:
        self._topic_indexer.ensure_indexed(message) # Index topics so they are available for retrieval in the same RAG turn
        context = self._retriever.build_context(message) # Fetch and build the RAG context based on the message (which is now indexed)
        self._print_context_preview(context)
        return context

    def _print_context_preview(self, context: str, max_preview_length: int = 300) -> None:
        """Print a preview of the RAG context to the console for debugging."""
        if context:
            preview = context[:max_preview_length] + "..." if len(context) > max_preview_length else context
            print(f"[RAGPipeline] Context injected ({len(context)} chars):\n{preview}\n")
        else:
            print("[RAGPipeline] No context injected.")
