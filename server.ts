import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  const distServer = path.join(process.cwd(), "dist", "server.cjs");
  if (fs.existsSync(distServer)) {
    const require = createRequire(import.meta.url);
    require(distServer);
  } else {
    await import("./server.app.ts");
  }
} else {
  await import("./server.app.ts");
}
