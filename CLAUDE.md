# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run build` - Compile TypeScript and run the variables output script
- `npm run start` - Start the production server from compiled JavaScript
- `npm run clean` - Remove the dist directory

## Project Architecture

This is a Railway environment inspection utility that serves Railway-specific environment variables via a Fastify web server. The project consists of two main components:

### Core Components

- **`src/index.ts`** - Main Fastify server that exposes a single endpoint returning Railway environment variables and server startup time
- **`src/variables.ts`** - Environment variable collection and output utilities that filter and manage RAILWAY\_\* prefixed variables plus PORT

### Key Architecture Details

- The server listens on `process.env.PORT` (default 8080) and binds to all interfaces (`::`)
- Environment variables are filtered to include only those starting with "RAILWAY\_" plus the PORT variable
- The build process compiles TypeScript to `dist/` and also executes the variables output script
- Both a legacy `index.js` file and the TypeScript version exist for environment variable inspection

### Railway Integration

- Configured for Railway deployment via `railway.json` with empty build configuration
- Uses Node.js 18.x runtime as specified in engines
- Dockerfile builds the application and runs the production start command

- Never run the dev script