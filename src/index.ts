import Fastify from "fastify";
import { getVariables, outputVariables } from "./variables";

const fastify = Fastify({
  logger: true,
});

const now = new Date();

outputVariables();

fastify.get("/", async (request, reply) => {
  const variables = getVariables();
  reply.code(200).send({
    started: now.toISOString(),
    ...variables,
  });
});

const port = process.env.PORT != null ? parseInt(process.env.PORT) : 8080;

const start = async () => {
  try {
    await fastify.listen({
      port,
      host: "::",
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

start();

// (err, address) => {
//   if (err) {
//     console.error(err);
//     process.exit(1);
//   }
//   console.log(`Server listening at ${address}`);
// }
