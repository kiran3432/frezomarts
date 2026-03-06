import { env } from "./config/env.js";
import { buildApp } from "./app.js";

async function start() {
  const app = await buildApp();
  await app.listen({ host: "0.0.0.0", port: env.PORT });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
