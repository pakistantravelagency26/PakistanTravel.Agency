import { spawn } from "child_process";

const server = spawn("node", ["./node_modules/next/dist/bin/next", "start", "-p", "3097"], {
  env: { ...process.env, PORT: "3097" },
  stdio: "pipe",
});

const pathsToTest = [
  "/.env",
  "/.env.local",
  "/.env.production",
  "/.git",
  "/.git/config",
  "/api/debug",
  "/api/test",
  "/api/seed",
  "/_next/static/chunks/main.js.map",
  "/backup.sql",
  "/backup.zip",
  "/database.tar.gz",
  "/public/",
  "/storybook",
  "/test",
  "/api/admin/seed",
  "/api/admin/reset",
  "/api/dev"
];

server.stdout.on("data", async (data) => {
  const str = data.toString();
  if (str.includes("Ready in") || str.includes("started server on")) {
    setTimeout(async () => {
      console.log("=== Exposed Files & Routes Security Audit Results ===");
      for (const p of pathsToTest) {
        try {
          const res = await fetch("http://127.0.0.1:3097" + p, {
            headers: { "User-Agent": "SecurityAuditCrawler/1.0" },
          });
          console.log(`[${res.status}] ${p} -> Status: ${res.status} ${res.statusText}`);
        } catch (err) {
          console.log(`[ERR] ${p} -> ${err.message}`);
        }
      }
      server.kill();
      process.exit(0);
    }, 1500);
  }
});

server.stderr.on("data", (d) => process.stderr.write(d));
