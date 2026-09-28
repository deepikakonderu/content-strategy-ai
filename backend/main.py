from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.hindsight_service import store_post, recall_content
from ai_agent.agent import generate_strategy


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


posts = []


@app.get("/")
def root():
    return {
        "message": "ContentMind backend is running!"
    }


@app.get("/api/posts")
def get_posts():
    return {
        "posts": posts
    }


@app.post("/api/posts")
def create_post(post: dict):
    # Store post temporarily
    posts.append(post)

    # Store post in Hindsight memory
    try:
        store_post(post)
        hindsight_status = "Memory stored successfully!"
    except Exception as e:
        hindsight_status = f"Hindsight error: {str(e)}"

    return {
        "message": "Post saved successfully!",
        "post": post,
        "hindsight": hindsight_status
    }


@app.get("/api/memory")
def get_memory():
    """Recall content memories from Hindsight."""

    try:
        memories = recall_content(
            "What content performed well and what topics should we consider for future posts?"
        )

        return {
            "memories": memories
        }

    except Exception as e:
        return {
            "memories": [],
            "error": str(e)
        }


@app.get("/api/strategy")
def get_strategy():
    """Generate a content strategy using Hindsight memories and the AI agent."""

    try:
        memories = recall_content(
            "Based on our previous content performance, "
            "what topics and types of content should we consider posting next?"
        )

        # Keep memory context small to reduce AI request size
        memories = memories[:5]

        strategy = generate_strategy(
            posts=posts,
            memories=memories
        )

        return strategy

    except Exception as e:
        return {
            "error": str(e)
        }