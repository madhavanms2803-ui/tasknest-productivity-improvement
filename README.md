# TaskNest — Productivity Score Improvement

TaskNest is a React + Express + PostgreSQL task manager. This submission investigates the original productivity-score implementation and replaces its inconsistent increments with a transparent score derived from task data.

## What changed

- Removed the stored-score increments that awarded points for creating tasks and completing tasks separately.
- Added an `isImportant` task flag; important completed tasks count twice in the completion component.
- Recorded `completedAt` when a task is completed and cleared it when reopened.
- Calculate a 0–100 score from a weighted task-completion rate (70%) and recent consistency (30% of the last seven calendar days with at least one completion).
- Added score breakdown and priority controls so users can understand what affects the score.

## Run locally

Requirements: Node.js 20+, PostgreSQL, and a configured `DATABASE_URL`.

```bash
cd server
npm install
# Set DATABASE_URL in server/.env (do not commit secrets)
npx prisma migrate dev --name tasknest_score_improvement
npm run dev
```

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Set `VITE_API_URL` in the client environment if the API is not running at `http://localhost:5000`. The frontend defaults to that local URL.

## Deployment notes

Deploy `server` as a Node web service and `client` as a static Vite site. Provision hosted PostgreSQL (for example Neon or Supabase), configure `DATABASE_URL` on the server, and set `VITE_API_URL` to the deployed server URL when building the frontend. Run the Prisma migration against the hosted database before serving traffic. Never commit database credentials.

See [`Changes.md`](./Changes.md) for investigation findings and the score formula.

## Validation status

The repository contains the implementation and setup instructions. Run the commands above against your own PostgreSQL instance to verify database migrations and end-to-end behavior before deployment.