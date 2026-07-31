# BeeKind — Run Guide (Client Handoff Ready)

This project is ready to share as a `.zip`.  
After unzipping on another machine, follow the quick-start below to run without setup confusion.

---

## Quick Start (new system)

1. Install **Node.js 18+** and ensure **MongoDB** is running.
2. Open terminal in the unzipped project root (`Beekind/`).
3. Run:

   ```bash
   npm run setup
   ```

   This command:
   - installs client/server dependencies,
   - creates `server/.env` and `client/.env` from examples (if missing),
   - ensures `server/uploads/` exists.

4. Open `server/.env` and set:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - optional API keys (OpenAI, OpenWeather, Azure OpenAI)
5. Seed scenes once:

   ```bash
   npm run seed:scenes
   ```

6. Start app:

   ```bash
   npm run dev
   ```

7. Open:
   - Client: `http://localhost:5174`
   - API: `http://localhost:5000`

BeeKind is an educational web app where **students** follow a **10-scene environmental story**, upload **task evidence** per scene, and receive **teacher approval** to advance. A **Bee** assistant (AI chat), **weather** panel, **end-of-journey quiz**, and a **3D “My Forest”** experience reward progress. **Teachers** review uploads and see a **class standings** view derived from progress, tasks, and quiz scores.

---

## Table of contents

1. [Tech stack](#tech-stack)  
2. [Repository layout](#repository-layout)  
3. [Core features](#core-features)  
4. [Prerequisites](#prerequisites)  
5. [Environment variables](#environment-variables)  
6. [Local development](#local-development)  
7. [Data & persistence](#data--persistence)  
8. [API overview](#api-overview)  
9. [Client routes](#client-routes)  
10. [Production / deployment notes](#production--deployment-notes)  

---

## Tech stack

| Layer | Technology |
|--------|------------|
| **Client** | React 18, React Router 6, Vite 5, Tailwind CSS 3 |
| **3D** | Three.js, React Three Fiber 8, Drei, Postprocessing (finale effects) |
| **Server** | Node.js (ESM), Express 4, Mongoose 8 |
| **Auth** | JWT (`Authorization: Bearer`), bcrypt password hashing |
| **Storage** | MongoDB; local disk `uploads/` for task images |
| **Integrations** | OpenAI (Bee chat), OpenWeather (optional), Azure OpenAI (optional) |

---

## Repository layout

```
Beekind/
├── package.json           # Root: concurrently runs client + server
├── client/                # Vite React SPA
│   ├── .env.example
│   ├── src/
│   │   ├── App.jsx        # Routes & auth guards
│   │   ├── pages/         # Screens (Dashboard, Scenes, Quiz, MyForest3D, …)
│   │   ├── components/    # UI, Layout, forest3d/*, DashboardHelpBee, …
│   │   ├── context/       # AuthContext
│   │   └── api/           # apiFetch, apiUrl
│   └── vite.config.js     # Dev server :5174, proxy /api & /uploads → :5000
├── server/
│   ├── .env.example
│   ├── src/
│   │   ├── index.js       # Express app, CORS, route mounts, scene upsert
│   │   ├── routes/        # auth, scenes, tasks, progress, ai, weather, quiz
│   │   ├── models/        # User, Scene, Submission, QuizAttempt, TaskSubmission
│   │   ├── data/          # scenesCurriculum, quizQuestions
│   │   ├── middleware/    # requireAuth, requireRole
│   │   └── utils/         # scene order, forest state, quiz session, levels
│   └── uploads/           # Created at runtime for multer task images
```

---

## Core features

### Students

- **Onboarding**: Splash, register, login (JWT session).
- **Journey**: 10 sequential scenes (`scene-1` … `scene-10`); strict prerequisite order for uploads and API.
- **Tasks**: Image upload per scene; status `pending` → teacher `approved` / `rejected`; points on approval.
- **Progress**: `completedSceneIds`, `progressLevel`, tier titles (Seed Saver → Tree Protector → Earth Guardian).
- **Celebrations**: Tier milestone overlays (SeedSaverCelebrationGate).
- **Bee chat**: AI helper (OpenAI / Azure) for questions.
- **Weather**: Live-style weather + AQI + suggestions (API key optional).
- **Quiz** (after all 10 scenes approved):
  - **One attempt** per student (no retake).
  - **10-minute** session from `POST /api/quiz/begin`; auto-submit when time ends; unanswered questions graded incorrect.
  - **Image questions** use the student’s **own approved** scene upload URLs (e.g. scenes 4 & 10), not static stock assets.
  - Optional **gentle mode** (hints) flag on begin/submit.
- **My Forest 3D** (`/forest-3d`): Full-viewport 3D scene driven by `GET /api/user/forest`; orbit explore, or **first-person + golden-hour** finale after scene 10; river, wildlife, child avatar, etc.
- **Dashboard help**: Floating bee + “Need any help?” bubble next to level pill; links to `/bee`.

### Teachers

- **Teacher dashboard**: Pending task list with approve/reject; recent quiz attempts log.
- **Student standings**: `GET /api/quiz/student-rankings` — weighted score from **points**, **scenes completed**, **approved tasks**, **best quiz score**; sorted list with **gold / silver / bronze** for top 3.

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)  
- **MongoDB** running locally or a connection string  
- **npm** (or compatible package manager)  

Optional:

- **OpenAI** (or Azure OpenAI) for Bee chat  
- **OpenWeather** key for weather  

---

## Environment variables

### Server (`server/.env`)

Copy from `server/.env.example`:

| Variable | Purpose |
|----------|---------|
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | Mongo connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `CLIENT_URL` | Allowed CORS origin (e.g. `http://localhost:5174`) |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | Bee chat (OpenAI) |
| `AZURE_*` | Optional Azure OpenAI (preferred when set) |
| `OPENWEATHER_API_KEY` | Weather + AQI |

### Client (`client/.env`)

Copy from `client/.env.example`:

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | **Production**: full API base URL. **Dev**: leave empty to use Vite proxy to `localhost:5000`. |

---

## Local development

1. **Install + initialize** (from repo root):

   ```bash
   npm run setup
   ```

   (Equivalent manual flow: `npm run install:all`, then copy env files and create `server/uploads`.)

2. **Configure env**

   - `server/.env` from `server/.env.example`  
   - `client/.env` optional in dev (proxy handles `/api` and `/uploads`)

3. **Seed curriculum scenes** (optional but recommended):

   ```bash
   npm run seed:scenes --prefix server
   ```

   The server also **upserts** scenes from `scenesCurriculum.js` on startup.

4. **Run both apps** (from root):

   ```bash
   npm run dev
   ```

   - Client: **http://localhost:5174**  
   - API: **http://localhost:5000**  

   Or run `npm run dev` inside `client/` and `server/` in two terminals.

5. **Client production build**

   ```bash
   npm run build --prefix client
   npm run preview --prefix client
   ```

6. **Server production**

   ```bash
   npm start --prefix server
   ```

---

## Data & persistence

### MongoDB models (primary)

| Model | Role |
|--------|------|
| **User** | `name`, `email`, `password`, `role` (`student` \| `teacher`), `points`, `progressLevel`, `completedSceneIds`, `quizSessionStartedAt` (active quiz window) |
| **Scene** | Curriculum: `id`, `title`, `theme`, `purpose`, `learningMessage`, `task`, etc. |
| **Submission** | Student task upload: `userId`, `sceneId`, `imageUrl`, `status` |
| **QuizAttempt** | One row per completed quiz; `score`, `maxScore`, `answers[]`, `adaptiveMode` |
| **TaskSubmission** | Legacy/auxiliary (referenced in some dashboard paths) |

### Static / seed data

- `server/src/data/scenesCurriculum.js` — 10-scene story content.  
- `server/src/data/quizQuestions.js` — Quiz items (text + image types; image URLs filled per user at runtime).

### Files on disk

- `server/uploads/` — Multer stores uploaded images; served at `/uploads/...`.

---

## API overview

Base URL in dev: **same origin as client** via proxy, or `http://localhost:5000` with `VITE_API_URL`.

**Auth** (`/api/auth` and `/auth`): register, login, JWT payload includes `sub` (user id) and `role`.

**Scenes** (`/api/scenes`): current scene, scene by id, list — tied to user progress.

**Tasks** (`/api/tasks`, `/api/task`): student upload; teacher `pending` list, approve/reject.

**User / progress** (`/api/user`): dashboard, progress, forest state (`/api/user/forest`), etc.

**Quiz** (`/api/quiz`):

- `GET /status` — eligibility, `quizCompleted`, last attempt summary, time limit info.  
- `POST /begin` — starts 10-minute session; returns personalized questions (student images).  
- `GET /questions` — reload questions **only** during an active session.  
- `POST /submit` — one-time graded submit; clears session.  
- `GET /student-rankings` — **teacher only**, leaderboard.  
- `GET /attempts` — **teacher only**, recent attempts.

**AI** (`/api/ai`): Bee chat completions.

**Weather** (`/api/weather`): query by lat/lon or city.

**Health** (`/api/health`): liveness.

*(Legacy non-`/api` mounts mirror some routes for compatibility.)*

---

## Client routes

| Path | Audience | Description |
|------|----------|-------------|
| `/` | Public | Splash |
| `/login`, `/register` | Public | Auth |
| `/dashboard` | Student | Home, progress, quiz card, help bee, links |
| `/scenes`, `/scenes/:sceneId` | Student | Current scene list & detail |
| `/tasks` | Student | Upload task image |
| `/bee` | Student | AI chat |
| `/weather` | Student | Weather widget page |
| `/quiz` | Student | End-of-journey quiz |
| `/forest-3d` | Student | Full-page 3D forest |
| `/teacher-dashboard` | Teacher | Reviews + standings |

Layout hides the main nav on `/forest-3d` for immersion; other student routes use the shared header + celebration gate where applicable.

---

## Production / deployment notes

1. Set **`CLIENT_URL`** to the **exact** browser origin of the React app (CORS).  
2. Set **`VITE_API_URL`** on the client build to the **public API URL** (no trailing slash issues—client helper normalizes).  
3. Serve **`client/dist`** via static hosting or CDN; ensure **SPA fallback** to `index.html` for client-side routes.  
4. Run the **Node server** with `MONGODB_URI`, `JWT_SECRET`, and persistent **`uploads/`** volume if using containers.  
5. **HTTPS** in production for cookies/secure contexts if you add them later.  
6. **React Three Fiber** bundle is large; consider code-splitting `MyForest3D` if initial load becomes a concern.

---

## Scripts reference (root)

| Command | Description |
|---------|-------------|
| `npm run setup` | Install deps and prepare local config (`.env` + uploads folder) |
| `npm run install:all` | Install `client` and `server` dependencies |
| `npm run seed:scenes` | Seed curriculum scenes into MongoDB |
| `npm run dev` | Run Vite + Express together (requires `concurrently`) |

---

## Document control

| Item | Value |
|-------|--------|
| **Purpose** | High-level application report & onboarding README |
| **Scope** | Full-stack BeeKind as implemented in this repository |
| **Maintainers** | Update this file when major features or env vars change |

---

*BeeKind — learn and protect nature, one scene at a time.*
