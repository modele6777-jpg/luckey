import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

// Ensure dev server uses port 3000 and ignores internal container PORT=8080
if (process.env.NODE_ENV !== "production") {
  const portArgIndex = process.argv.findIndex((arg) => arg === "--port" || arg === "-p");
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    process.env.PORT = process.argv[portArgIndex + 1];
  } else if (!process.env.PORT || process.env.PORT === "8080") {
    process.env.PORT = "3000";
  }
}

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

