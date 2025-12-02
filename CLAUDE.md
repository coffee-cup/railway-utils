# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `mise run check` - typecheck after changes
- `bun dev` - start dev server with HMR
- `bun start` - run production server
- `bun test` - run tests
- Do NOT run `bun dev` without user permission (user runs this separately)

## Tech Stack

Bun + React 19 + Tailwind v4. Uses Bun's HTML imports for bundling (no vite/webpack).

## Architecture

- `src/index.tsx` - Bun.serve() server with API routes, serves index.html for frontend
- `src/index.html` - HTML entry point, imports frontend.tsx
- `src/frontend.tsx` - React root, renders App
- `src/App.tsx` - main React component

## Bun APIs

Use Bun built-ins instead of npm packages:
- `Bun.serve()` not express
- `bun:sqlite` not better-sqlite3
- `Bun.file()` not fs.readFile/writeFile
- `Bun.$` not execa
- Built-in WebSocket, not ws

For more information, read `node_modules/bun-types/docs/**.md`.
- Use `mise run check` to typecheck
- use context7 to get up to date library information