# ContentMind

Memory-Powered Content Strategy Agent (Hackathon MVP)

---

## What it is

**ContentMind** is an intelligent, memory-powered content strategy agent designed for content creators, marketers, and social media strategists. 

Content creators constantly wrestle with the question: **"What should I post next?"** Instead of guessing or posting random ideas, ContentMind acts as an analytical memory agent that studies your past content performance (views, likes, comments, shares, engagement ratios, and topic history) to calculate high-confidence recommendations for your next piece of content.

---

## Current frontend features

- **Dynamic Analytics Dashboard:**
  - Real-time statistics computed on-the-fly: **Total Posts**, **Total Views**, **Average Engagement (%)**, and **Top Performing Topic**.
  - **Top Performing Topics breakdown:** Ranked performance cards with proportional reach progress indicators and average engagement metrics.
  - **Recent Content list:** Displays past posts with platforms, topics, publication dates, and detailed interaction metrics (views, likes, comments, shares, and engagement rate).
  - Search and filter by topic or keyword.
  - Delete individual posts or reset to the 8-post realistic demo dataset at any time.

- **Add Content Workflow (`/add-content`):**
  - Form allowing creators to record past posts with Title, Description, Topic, Platform (LinkedIn, Instagram, YouTube, Twitter/X, Blog, Other), Date, and performance metrics (Views, Likes, Comments, Shares).
  - Client-side validation ensuring required fields and non-negative numbers (`>= 0`).
  - Quick-prefill demo buttons for rapid testing during hackathon presentations.
  - Instant persistence to browser `localStorage` and immediate dashboard synchronization.

- **Content Strategist Engine (`/strategy`):**
  - The centerpiece hackathon demo: answers **"What should I post next?"**.
  - Analyzes the stored posts using a deterministic strategy algorithm (`generateMockStrategy`).
  - Outputs a concrete **Recommended Topic**, a specific **Content Idea / Hook**, actionable **Mathematical Reasoning**, and exact **Evidence from Memory** (referencing specific view counts and engagement numbers).
  - Provides suggested format recommendations, optimal platform targeting, and identified content gaps.
  - One-click copy for the recommended idea.

- **Visual Memory Context Component:**
  - Displays the active agent memory state:
    - ✓ Previous content analyzed
    - ✓ Content performance remembered
    - ✓ Successful topics identified
    - ✓ Content gaps identified
  - Visual status: *"Currently using local content history"* with a **Demo Memory** badge.
  - Expandable planned memory flow illustrating the upcoming Hindsight memory pipeline.

- **Decoupled Architecture with Service Layer (`src/services/api.js`):**
  - All UI components talk exclusively to an asynchronous service layer (`getPosts`, `addPost`, `deletePost`, `generateStrategy`).
  - When backend developers join the project, this single file can be swapped with real HTTP `fetch()` endpoints without altering any component code.

---

## Tech stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** JavaScript / React JSX
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Custom Plain CSS (Pure CSS design system with CSS custom properties, zero Tailwind/CSS-framework bloat, fully responsive across mobile, tablet, and desktop)
- **Icons:** `lucide-react`
- **Data Persistence:** Browser `localStorage` (key: `contentmind_posts`)

*Note: No external AI APIs, backend servers, databases (Firebase, Supabase, MongoDB), or UI component libraries (Tailwind, Material UI, Shadcn) are used in this MVP frontend.*

---

## How to install

Clone the repository and install the dependencies:

```bash
npm install
```

---

## How to run

Start the local development server:

```bash
npm run dev
```

Then open your browser at:
```
http://localhost:3000
```

To build for production:
```bash
npm run build
```

---

## Current architecture

At this stage, ContentMind operates as a standalone frontend MVP:

```
[ User Input / Form ]
        │
        ▼
[ src/services/api.js ]
        │
        ▼
[ src/utils/storage.js ] ──> browser `localStorage` ("contentmind_posts")
        │
        ▼
[ src/utils/analytics.js & strategy.js ]
        │ (Deterministic algorithm analyzing past views, likes, & topics)
        ▼
[ UI Render (Dashboard & Strategy Pages) ]
```

- When the application first loads, if `contentmind_posts` is empty, it automatically seeds 8 realistic developer/AI posts so hackathon judges can immediately see live data.
- User additions, deletions, or data resets immediately update `localStorage` and trigger re-renders.

---

## Future architecture

In the upcoming phase, the mock and `localStorage` logic will be replaced with real backend API routes connecting to the **Hindsight memory engine** and an autonomous AI agent:

```
Frontend (React UI)
       │
       ▼
Backend API (REST /api/posts & /api/strategy)
       │
       ▼
Hindsight Long-Term Memory (vector & semantic recall of all past content)
       │
       ▼
AI Strategy Agent (synthesizes trends, competitor signals, & next optimal topic)
       │
       ▼
Backend API (structured JSON response)
       │
       ▼
Frontend (interactive strategy dashboard)
```

> **Important Note:** Hindsight is not yet connected in this frontend-only MVP release. The UI includes a transparent "Demo Memory" badge and memory context visualizer to demonstrate readiness for the backend connection.

---

## Project Structure

```
contentmind-hindsight/
├── index.html
├── metadata.json
├── package.json
├── README.md
├── vite.config.ts
├── src/
│   ├── main.tsx             # Application entry point
│   ├── App.jsx              # React Router setup & shell layout
│   ├── index.css            # Pure CSS design system & responsive styling
│   ├── data/
│   │   └── demoData.js      # 8 realistic starter posts
│   ├── services/
│   │   └── api.js           # Decoupled mock API service layer
│   ├── utils/
│   │   ├── storage.js       # localStorage CRUD helpers
│   │   ├── analytics.js     # Engagement, views, & topic metrics calculations
│   │   └── strategy.js      # Deterministic strategy recommendation engine
│   ├── components/
│   │   ├── Navbar.jsx       # Top navigation & memory status
│   │   ├── StatCard.jsx     # Dashboard metric card
│   │   ├── ContentCard.jsx  # Content history post card
│   │   ├── Button.jsx       # Reusable button with variants
│   │   ├── MemoryContext.jsx# Visual memory layer & Hindsight roadmap
│   │   ├── StrategyCard.jsx # Strategy recommendation card
│   │   ├── EmptyState.jsx   # Empty state handler
│   │   └── Toast.jsx        # Notification toast
│   └── pages/
│       ├── Dashboard.jsx    # Stats, topics, & recent content
│       ├── AddContent.jsx   # Post creation form with validation
│       └── Strategy.jsx     # "What should I post next?" agent demo
```
