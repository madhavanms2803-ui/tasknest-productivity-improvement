# TaskNest — Productivity Score Improvement

TaskNest is a React + Express + PostgreSQL task manager. This submission improves the existing productivity score so the number is derived from current task data, explained in the UI, and responsive to task importance and consistency.

## What changed

- Replaced score increments stored on task creation/completion with one deterministic calculation from the current tasks.
- Added an Important flag that persists per task and gives completed important tasks twice the weight of regular tasks.
- Added completion timestamps so the score can include recent consistency.
- Made task updates idempotent: repeating the same completion request does not award duplicate points.
- Added validation and clearer HTTP error responses.
- Added a pure scoring helper and unit tests.

## Transparent scoring model

The total is capped at 100 points:

1. Task completion (up to 80 points): completed task weight divided by total task weight, multiplied by 80. Important tasks have weight 2; regular tasks have weight 1.
2. Consistency (up to 20 points): 20 multiplied by the number of distinct days with at least one completed task in the trailing seven-day window, divided by 7.
3. The final score is the rounded sum of both parts. With no tasks, the score is 0.

The score endpoint also returns the two components and task counts, so the UI can explain how the result was reached. This is a product metric—not a measure of a person's worth or energy level.

## Requirements

- Node.js 20+
- PostgreSQL
- npm

## Run locally

### 1. Backend

From the repository root:

- Run cd server
- Run npm install
- Copy .env.example to .env and set DATABASE_URL to your PostgreSQL connection string.
- Run npx prisma db push
- Run npm run dev

The API listens on port 5000 by default. DATABASE_URL, PORT, and CORS_ORIGIN are configured through environment variables.

### 2. Frontend

In a second terminal:

- Run cd client
- Run npm install
- Copy .env.example to .env (the default API URL is http://localhost:5000).
- Run npm run dev

Run checks with npm run build and npm run lint in client, and npm test in server.

## Deployment configuration

Use a hosted PostgreSQL database such as Neon or Supabase, deploy server to a Node-compatible host such as Render, and deploy client to a static host such as Netlify.

Set the backend's DATABASE_URL, PORT (usually supplied by the host), and CORS_ORIGIN (the deployed frontend origin). Set the frontend's VITE_API_URL to the deployed backend URL, without a trailing slash. Apply the Prisma schema to the hosted database with npx prisma db push before serving traffic.

Deployment and the requested explanation video should be completed and their URLs added to the assignment submission after hosting; they are not represented as completed by this repository.
