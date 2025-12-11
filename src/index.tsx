import { serve } from "bun";
import { RedisClient, sql } from "bun";
import index from "./index.html";
import { getVariables, toEnvFormat } from "./variables";

const variables = getVariables();
console.log(toEnvFormat(variables));

const serverStartTime = new Date().toISOString();
const hasRedis = !!process.env.REDIS_URL;
const hasPostgres = !!process.env.DATABASE_URL;
let postgresInited = false;

async function initPostgres() {
  if (postgresInited) return;
  await sql`
    CREATE TABLE IF NOT EXISTS counter (
      id TEXT PRIMARY KEY,
      value INTEGER NOT NULL DEFAULT 0
    )
  `;
  postgresInited = true;
}

const port = process.env.PORT || 8080;
console.log(`Server running on port ${port}`);

const server = serve({
  hostname: "::",
  port,

  routes: {
    "/*": index,

    "/api/info": () =>
      Response.json({
        info: {
          serverStartTime,
          requestTime: new Date().toISOString(),
          hasRedis,
          hasPostgres,
        },
        variables: getVariables(),
      }),

    "/api/crash": () => {
      console.log("Crash requested, exiting...");
      process.exit(1);
    },

    "/api/redis": async () => {
      if (!hasRedis) {
        return Response.json({ error: "REDIS_URL not configured" }, { status: 503 });
      }

      const client = new RedisClient(process.env.REDIS_URL);

      try {
        const start = performance.now();
        const count = await client.incr("test-counter");
        const elapsed = performance.now() - start;

        client.close();

        return Response.json({
          count,
          ms: Math.round(elapsed * 100) / 100,
        });
      } catch (e) {
        client.close();
        return Response.json({ error: String(e) }, { status: 500 });
      }
    },

    "/api/postgres": async () => {
      if (!hasPostgres) {
        return Response.json({ error: "DATABASE_URL not configured" }, { status: 503 });
      }

      await initPostgres();

      try {
        const start = performance.now();
        const result = await sql`
          INSERT INTO counter (id, value) VALUES ('test', 1)
          ON CONFLICT (id) DO UPDATE SET value = counter.value + 1
          RETURNING value
        `;
        const elapsed = performance.now() - start;

        return Response.json({
          count: result[0].value,
          ms: Math.round(elapsed * 100) / 100,
        });
      } catch (e) {
        return Response.json({ error: String(e) }, { status: 500 });
      }
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`Server running at ${server.url}`);
