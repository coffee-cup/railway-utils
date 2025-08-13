# CLAUDE.md

## Development Commands

- `bun run start` - Start the server
- `bun run check` - TypeScript check
- Never run the dev script

## Project Overview

Railway environment inspection utility using Bun. Serves RAILWAY_* environment variables via HTTP.

- **`src/index.ts`** - Bun server exposing Railway vars at `/`
- **`src/variables.ts`** - Environment variable filtering utilities

Server listens on `PORT` (default 8080) and returns filtered Railway environment variables.
