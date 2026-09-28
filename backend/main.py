from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    return {"message": "ContentMind backend is running!"}


@app.get("/api/posts")
def get_posts():
    return {
        "posts": posts
    }


@app.post("/api/posts")
def create_post(post: dict):
    posts.append(post)

    return {
        "message": "Post saved successfully!",
        "post": post
    }