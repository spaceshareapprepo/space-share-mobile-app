import { createRequestHandler } from "expo-server/adapter/vercel";
import path from "node:path";

const handler = createRequestHandler({
  build: path.join(process.cwd(), "dist/server"),
});

export default handler;
