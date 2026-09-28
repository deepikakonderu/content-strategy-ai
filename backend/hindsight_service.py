import os
from pathlib import Path

from dotenv import load_dotenv
from hindsight_client import Hindsight


# Load the .env file from the hindsight folder
env_path = Path(__file__).resolve().parent.parent / "hindsight" / ".env"
load_dotenv(env_path, override=True)


HINDSIGHT_URL = os.getenv(
    "HINDSIGHT_API_URL",
    "http://localhost:8888"
)

HINDSIGHT_API_KEY = os.getenv("HINDSIGHT_API_KEY") or None

BANK_ID = "contentmind"


def get_client():
    """Create a Hindsight client."""
    return Hindsight(
        base_url=HINDSIGHT_URL,
        api_key=HINDSIGHT_API_KEY
    )


def store_post(post: dict):
    """Store a content post and its performance in Hindsight."""

    client = get_client()

    try:
        content = f"""
        Content topic: {post.get("topic", "Unknown")}
        Title: {post.get("title", "Unknown")}
        Views: {post.get("views", "Unknown")}
        Likes: {post.get("likes", "Unknown")}
        Comments: {post.get("comments", "Unknown")}
        Shares: {post.get("shares", "Unknown")}
        """

        client.retain(
            bank_id=BANK_ID,
            content=content,
            context="Content performance"
        )

    finally:
        client.close()


def recall_content(query: str):
    """Recall relevant content memories from Hindsight."""

    client = get_client()

    try:
        result = client.recall(
            bank_id=BANK_ID,
            query=query
        )

        return [memory.text for memory in result.results]

    finally:
        client.close()