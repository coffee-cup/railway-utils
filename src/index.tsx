import { serve } from "bun";
import index from "./index.html";
import { getVariables, toEnvFormat } from "./variables";

const variables = getVariables();
console.log(toEnvFormat(variables));

const serverStartTime = new Date().toISOString();

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
        },
        variables: getVariables(),
      }),

    "/api/crash": () => {
      console.log("Crash requested, exiting...");
      process.exit(1);
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`Server running at ${server.url}`);
