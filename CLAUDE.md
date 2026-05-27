# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Scope override

This repo opts **out** of the project-assistant role defined in the parent [/Users/anirach/Code/CLAUDE.md](../CLAUDE.md). Inside this repository (`IT-fullstack/`), Claude Code operates with full default capabilities: running bash commands, launching the dev server and backend, executing scripts, and editing source code are all permitted. The parent file's "What You CANNOT Do" section does not apply here. The parent restrictions remain in force for sibling projects under `/Users/anirach/Code/`.

## Repository purpose

A "Study Full Stack course" learning repo (see [README.md](README.md)). The backend folder [src/](src/) contains several **standalone, mutually exclusive** Express servers that each demonstrate a different persistence strategy for the same `/books` REST API. The frontend in [client/](client/) is a single React + Vite app that talks to whichever backend variant is currently running.

When a task references "the backend", clarify which variant — they cannot run at the same time (all four book servers bind port `5500`).

## Commands

### Backend (run from repo root)

```bash
npm install                       # one-time, installs express, sequelize, sqlite3, pg, dotenv
npm start                         # runs node src/index.js (hello-world on :3000, NOT a books API)
node src/CRUDBookNoDB.js          # in-memory books API on :5500
node src/CRUDBookSQLite.js        # sqlite3 books API on :5500, uses Database/Book.sqlite
node src/SequelizeCRUD.js         # Sequelize+SQLite on :5500, uses Database/Books.sqlite
node src/PGCRUD.js                # Sequelize+Postgres on :5500 (remote DB, creds hard-coded)
npm run format                    # prettier --write *.js (only formats root-level .js)
```

There is no test runner and no linter — only Prettier.

### Frontend (run from [client/](client/))

```bash
npm install
npm run dev                       # Vite dev server on :3000, proxies /books → :5500
npm run build                     # outputs client/dist
npm run preview                   # serves the built bundle
```

The client has no separate config for which backend to hit — it always proxies `/books` to `localhost:5500`, so just start one of the four books backends above before `npm run dev`.

## Architecture

### The four backend variants

All four book servers in [src/](src/) expose the **same REST surface** — `GET /books`, `GET /books/:id`, `POST /books`, `PUT /books/:id`, `DELETE /books/:id` — and the same `{id, title, author}` shape. They differ only in storage:

| File | Storage | Notes |
|---|---|---|
| [src/CRUDBookNoDB.js](src/CRUDBookNoDB.js) | In-memory array | Resets on restart; seeded with 3 books. |
| [src/CRUDBookSQLite.js](src/CRUDBookSQLite.js) | sqlite3 (raw SQL) | File: [Database/Book.sqlite](Database/Book.sqlite). |
| [src/SequelizeCRUD.js](src/SequelizeCRUD.js) | Sequelize over SQLite | File: [Database/Books.sqlite](Database/Books.sqlite) (note the `s` — different file from the raw-SQL variant). |
| [src/PGCRUD.js](src/PGCRUD.js) | Sequelize over remote Postgres | Connection string is hard-coded at [src/PGCRUD.js:15](src/PGCRUD.js#L15). |

When making changes that should apply to "the books API", apply them across all four files unless the user specifies otherwise — they are parallel teaching examples, not a single evolving codebase.

[src/index.js](src/index.js) and [src/hello.js](src/hello.js) are unrelated minimal examples and are not part of the books API surface. `package.json#main` points at `hello.js`, and `npm start` runs `index.js` (port `3000`), neither of which the frontend can talk to.

### Frontend ⇄ backend contract

The Vite proxy at [client/vite.config.js:8-10](client/vite.config.js#L8-L10) forwards `/books` to `http://localhost:5500`, so the client uses relative URLs (`axios` with `baseURL: '/'`) and needs no env switching. CORS is therefore a non-issue **in dev**; for production hosting the client separately, the backends would need CORS middleware added (none of them have it).

The React app is intentionally small: [App.jsx](client/src/App.jsx) holds list/editing/error state, [api/books.js](client/src/api/books.js) is the thin axios wrapper, and the form/list components are presentational. After every mutation the client calls a full `refresh()` rather than updating local state — a deliberate simplification.

### Configuration

A repo-root [.env](.env) exists with `PORT=5000`, but **no backend reads it** — every `require("dotenv").config()` line is commented out and the port is hard-coded to `5500` in the books servers (and `3000` in [src/index.js](src/index.js)). Don't assume `.env` is wired up.
