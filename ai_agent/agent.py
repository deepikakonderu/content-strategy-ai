import json
import os
from statistics import mean

from dotenv import load_dotenv
from groq import Groq

from prompts import SYSTEM_PROMPT


# Load environment variables from .env
load_dotenv()

MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")


def get_client():
    """Create the Groq client only when an AI request is needed."""

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key or api_key == "your_groq_api_key_here":
        raise ValueError(
            "GROQ_API_KEY is not configured. "
            "Create ai_agent/.env and add your real Groq API key."
        )

    return Groq(api_key=api_key)




def calculate_metrics(posts):
    """
    Calculate reliable numerical metrics from the supplied posts.
    These values are calculated by Python rather than the LLM.
    """

    if not posts:
        return {
            "topTopicViews": 0,
            "topTopicAvgEngagement": 0,
            "analyzedPostsCount": 0,
            "overallAvgEngagement": 0
        }

    topic_data = {}

    engagement_rates = []

    for post in posts:
        topic = post.get("topic", "Unknown")

        views = float(post.get("views", 0) or 0)
        likes = float(post.get("likes", 0) or 0)
        comments = float(post.get("comments", 0) or 0)
        shares = float(post.get("shares", 0) or 0)

        # Engagement rate based on views
        engagement_rate = (
            ((likes + comments + shares) / views) * 100
            if views > 0
            else 0
        )

        engagement_rates.append(engagement_rate)

        if topic not in topic_data:
            topic_data[topic] = {
                "views": 0,
                "engagement_rates": []
            }

        topic_data[topic]["views"] += views
        topic_data[topic]["engagement_rates"].append(
            engagement_rate
        )

    # Find topic with highest total views
    top_topic = max(
        topic_data.items(),
        key=lambda item: item[1]["views"]
    )

    top_topic_name = top_topic[0]
    top_topic_views = top_topic[1]["views"]

    top_topic_avg_engagement = mean(
        top_topic[1]["engagement_rates"]
    )

    overall_avg_engagement = mean(engagement_rates)

    return {
        "topTopicViews": round(top_topic_views, 2),
        "topTopicAvgEngagement": round(
            top_topic_avg_engagement, 2
        ),
        "analyzedPostsCount": len(posts),
        "overallAvgEngagement": round(
            overall_avg_engagement, 2
        ),
        "topTopic": top_topic_name
    }


def build_user_prompt(posts, memories, metrics):
    """
    Prepare the information that will be given to the LLM.
    """

    return f"""
Analyze the following content history and recalled long-term
memory to create a content strategy.

CONTENT HISTORY:
{json.dumps(posts, indent=2)}

RELEVANT HINDSIGHT MEMORIES:
{json.dumps(memories, indent=2)}

CALCULATED METRICS:
{json.dumps(metrics, indent=2)}

Use the calculated metrics as factual information.

Look for:
- High-performing topics
- Low-performing topics
- Repeated topics
- Audience interests
- Under-covered topics
- Content gaps
- Opportunities for future content

Return ONLY valid JSON matching the required schema.
"""


def parse_json_response(response_text):
    """
    Convert the LLM response into a Python dictionary.
    """

    cleaned = response_text.strip()

    # Handle accidental markdown JSON fences
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]

    if cleaned.startswith("```"):
        cleaned = cleaned[3:]

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)

    except json.JSONDecodeError as exc:
        raise ValueError(
            "The AI model returned invalid JSON.\n\n"
            f"Model response:\n{response_text}"
        ) from exc


def validate_strategy(strategy):
    """
    Ensure the AI response contains the fields expected by
    the existing ContentMind frontend.
    """

    required_fields = [
        "recommendedTopic",
        "contentIdea",
        "reasoning",
        "evidence",
        "targetPlatform",
        "formatSuggestion",
        "audienceInsight",
        "contentGap"
    ]

    missing_fields = [
        field
        for field in required_fields
        if field not in strategy
    ]

    if missing_fields:
        raise ValueError(
            "AI response is missing required fields: "
            + ", ".join(missing_fields)
        )

    if not isinstance(strategy["evidence"], list):
        strategy["evidence"] = [str(strategy["evidence"])]

    return strategy


def generate_strategy(posts=None, memories=None):
    """
    Main AI Agent function.

    Parameters:
        posts:
            Historical content posts.

        memories:
            Relevant memories retrieved from Hindsight.

    Returns:
        Strategy object compatible with the existing
        ContentMind StrategyCard component.
    """

    posts = posts or []
    memories = memories or []

    metrics = calculate_metrics(posts)

    # No historical content
    if not posts:
        return {
            "recommendedTopic": "Foundation Content",
            "contentIdea": (
                "Create introductory content that clearly "
                "explains your core expertise."
            ),
            "reasoning": (
                "There is not enough historical content to "
                "identify reliable audience patterns yet."
            ),
            "evidence": [
                "Memory history: 0 posts recorded"
            ],
            "targetPlatform": "LinkedIn",
            "formatSuggestion": (
                "Text Post + Personal Insight Carousel"
            ),
            "audienceInsight": (
                "No historical interactions are available yet."
            ),
            "contentGap": (
                "More historical content is needed to identify "
                "audience preferences and topic gaps."
            ),
            "metricsSummary": metrics
        }

    user_prompt = build_user_prompt(
        posts,
        memories,
        metrics
    )

    client = get_client()

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        temperature=0.3
    )

    response_text = response.choices[0].message.content

    strategy = parse_json_response(response_text)

    strategy = validate_strategy(strategy)

    # Add trusted Python-calculated metrics.
    strategy["metricsSummary"] = metrics

    return strategy


if __name__ == "__main__":
    print("ContentMind AI Agent")
    print("Set GROQ_API_KEY in .env before running.")