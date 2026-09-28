# SentryLine Demo

A small, self-contained demo of the SentryLine idea: an approval queue that
sits between an AI assistant and the tools it wants to use.

This is **not** the real [SentryLine](https://github.com/sentryline/sentryline) —
that project is a local governance daemon with real connectors, OS-level
privilege separation, and a live MCP endpoint, which can't run on Vercel.
This demo is a plain Next.js web app with simulated requests, built to show
the concept: a queue, approve/deny actions, an audit log, and a connectors
list.

## Features

- **Queue** — pending "requests" from a (simulated) AI assistant, each with
  the tool it wants to call, why, and a risk note when relevant. Approve or
  deny each one.
- **Audit log** — every decision, with a timestamp.
- **Connectors** — a list of systems that can be turned on or off.

Data lives in memory on the server. It resets whenever the app cold-starts
or redeploys — good enough for a demo, not for production. To make this
persistent, swap `lib/store.js` for a real database (Postgres, Vercel KV,
etc.).

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new), import the repository,
   and click **Deploy** — no configuration needed, Vercel detects Next.js
   automatically.

## Project structure

```
pages/
  index.js          Queue page
  audit.js          Audit log page
  connectors.js     Connectors page
  api/
    requests/       List + approve/deny requests
    audit.js        List decided requests
    connectors.js   List + toggle connectors
components/
  Layout.js         Sidebar navigation shared by every page
lib/
  store.js          In-memory data (swap for a real DB to persist)
  time.js           Relative-time formatting helper
styles/
  globals.css       All styling, no CSS framework
```
