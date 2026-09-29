# ContentMind Frontend

### Memory-Powered Content Strategy Agent

The ContentMind frontend is the React-based user interface for a memory-powered content strategy application.

It allows content creators and marketers to:

- Track previous content and its performance
- Analyze content performance
- Add new content history
- View high-performing topics
- Request AI-powered content strategy recommendations
- Understand how historical content contributes to future recommendations

The frontend communicates with the ContentMind FastAPI backend, which handles Hindsight memory and the AI strategy agent.

---

# ✨ Features

## 📊 Dashboard

The Dashboard provides an overview of the creator's content history and performance.

It displays:

- Total posts
- Total views
- Average engagement
- Top-performing topic
- Topic performance breakdown
- Recent content
- Views
- Likes
- Comments
- Shares
- Engagement rate

The dashboard is designed to give the creator a quick understanding of what has performed well historically.

---

## ➕ Add Content

The Add Content page allows users to record previously published content.

Users can enter:

- Title
- Description
- Topic
- Platform
- Publication date
- Views
- Likes
- Comments
- Shares

Supported platforms include:

- LinkedIn
- Instagram
- YouTube
- Twitter/X
- Blog
- Other

The form also validates required fields and performance metrics.

When content is submitted, the frontend sends the post to the FastAPI backend.

---

## 🧠 Content Strategy

The Strategy page answers the main question:

> **"What should I post next?"**

The frontend requests a strategy from the backend.

The backend combines:

```text
Historical Content
        +
Calculated Performance Metrics
        +
Hindsight Memories
        +
AI Strategy Agent
        ↓
Content Recommendation
