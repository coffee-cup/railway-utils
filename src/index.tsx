import { serve } from "bun";
import index from "./index.html";
import { getVariables } from "./variables";

const serverStartTime = new Date().toISOString();

const server = serve({
  routes: {
    "/*": index,

    "/api/info": () =>
      Response.json({
        info: {
          serverStartTime,
          requestTime: new Date().toISOString(),
        },
        variables: getVariables(),
      }),
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`Server running at ${server.url}`);
