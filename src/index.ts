import { getVariables, outputVariables } from "./variables";

const now = new Date();

outputVariables();

const port = process.env.PORT != null ? parseInt(process.env.PORT) : 8080;

const server = Bun.serve({
  port,
  hostname: "::",
  fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === "/") {
      const variables = getVariables();
      return Response.json({
        started: now.toISOString(),
        ...variables,
      });
    }
    
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server listening at ${server.url}`);
