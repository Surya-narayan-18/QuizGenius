# 🧠 QuizGenius — AI-Powered Quiz App

QuizGenius generates real, topic-accurate multiple-choice quizzes on any subject using Google Gemini AI. Pick a topic, choose difficulty, and test your knowledge!

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router
- **Backend:** Express.js (Node.js)
- **AI:** Google Gemini API (server-side only)

## Project Structure

```
/QUIZ
  /backend
    server.js          → Express server (API + static file serving)
    package.json
  /frontend
    /src               → React app source
    package.json
  .env                 → Environment variables (create from .env.example)
  .env.example
```

## Setup

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` at the project root:

```bash
cp .env.example .env
```

Fill in your values:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key ([get one here](https://aistudio.google.com/apikey)) |
| `QUIZ_TOKEN_SECRET` | Any random 32+ character string for HMAC signing |

### 3. Run Locally (Development)

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm start
```
This starts the Express API server at `http://localhost:5000`.

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
This starts Vite at `http://localhost:5173` with API requests proxied to the backend.

Open `http://localhost:5173` in your browser.

### 4. Deploy to Render

1. Push your repo to GitHub.
2. On [Render](https://render.com), create a **Web Service**.
3. Set these values:
   - **Build Command:** `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command:** `cd backend && node server.js`
4. Add environment variables in Render's dashboard:
   - `GEMINI_API_KEY`
   - `QUIZ_TOKEN_SECRET`
   - `NODE_ENV` = `production`
5. Deploy! The Express server serves both the API and the built frontend.

## API Endpoints

### `POST /api/quiz/generate`
Generates quiz questions using Gemini AI.

**Request:**
```json
{ "topic": "World War II", "difficulty": "medium", "numQuestions": 10 }
```

**Response:**
```json
{ "quizToken": "...", "questions": [{ "id": "q_0", "question": "...", "options": ["A", "B", "C", "D"] }] }
```

### `POST /api/quiz/submit`
Scores a completed quiz.

**Request:**
```json
{ "quizToken": "...", "answers": { "q_0": 2, "q_1": 0 } }
```

**Response:**
```json
{ "score": 8, "total": 10, "results": [{ "id": "q_0", "question": "...", "correctIndex": 2, "selectedIndex": 2, "isCorrect": true, "explanation": "..." }] }
```

## License

MIT
