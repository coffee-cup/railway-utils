import { serve } from "bun";
import { RedisClient } from "bun";
import index from "./index.html";
import { getVariables, toEnvFormat } from "./variables";

const variables = getVariables();
console.log(toEnvFormat(variables));

const serverStartTime = new Date().toISOString();
const hasRedis = !!process.env.REDIS_URL;

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
      const testKey = `bun-test:${Date.now()}`;
      const testValue = `value-${Math.random()}`;

      try {
        const start = performance.now();
        await client.set(testKey, testValue);
        const got = await client.get(testKey);
        await client.del(testKey);
        const elapsed = performance.now() - start;

        client.close();

        return Response.json({
          ok: got === testValue,
          setGetDelMs: Math.round(elapsed * 100) / 100,
        });
      } catch (e) {
        client.close();
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
