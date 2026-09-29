# ContentMind 🧠

### Memory-Powered Content Strategy Agent

ContentMind is an AI-powered content strategy agent that learns from a creator's previous content and performance history to recommend what to create next.

Instead of generating generic content ideas, ContentMind combines:

- 📊 Historical content performance
- 🧠 Long-term memory with Hindsight
- 🤖 AI-powered reasoning with Groq
- 🔎 Memory recall for relevant past content
- 💡 Personalized content strategy recommendations

Built for the **HackwithHyderabad Hackathon**.

---

## 🚀 The Problem

Content creators and marketers often ask:

> **"What should I post next?"**

Traditional AI content tools can generate ideas, but they often lack knowledge of the creator's own history.

For example:

- Which topics performed well?
- Which topics consistently receive engagement?
- Which topics have been overused?
- What content gaps exist?
- What does the audience appear to care about?
- What should be created next based on previous results?

ContentMind solves this by giving the AI a **long-term memory of the creator's content history**.

---

## 💡 Our Solution

ContentMind remembers previous content and its performance using **Hindsight**.

When a new post is added:

1. The frontend sends the post to the FastAPI backend.
2. The backend stores the post.
3. The post's topic and performance metrics are retained in Hindsight.
4. When the user requests a strategy, relevant memories are recalled.
5. The AI agent analyzes:
   - Historical posts
   - Recalled Hindsight memories
   - Calculated engagement metrics
6. The AI generates a structured content recommendation.
7. The frontend displays the recommendation in the Strategy dashboard.

### Core idea

> **Don't just generate content. Remember what worked and use that memory to decide what comes next.**

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     React Frontend  │
                    │                     │
                    │  Dashboard          │
                    │  Add Content        │
                    │  Strategy           │
                    └──────────┬──────────┘
                               │
                               │ HTTP / REST
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI Backend  │
                    │                     │
                    │  GET  /api/posts    │
                    │  POST /api/posts    │
                    │  GET  /api/memory   │
                    │  GET  /api/strategy │
                    └──────┬────────┬─────┘
                           │        │
                 retain    │        │ recall
                           ▼        ▼
                  ┌─────────────────────┐
                  │      Hindsight      │
                  │   Long-Term Memory  │
                  │                     │
                  │ Content history     │
                  │ Performance         │
                  │ Topics               │
                  └──────────┬──────────┘
                             │
                             │ Relevant memories
                             ▼
                  ┌─────────────────────┐
                  │    AI Strategy      │
                  │       Agent         │
                  │                     │
                  │      Groq LLM       │
                  └──────────┬──────────┘
                             │
                             │ Structured strategy
                             ▼
                    ┌─────────────────────┐
                    │   React Strategy    │
                    │      Dashboard      │
                    └─────────────────────┘
