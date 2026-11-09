import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

describe("GROUP 6: Debug Mode, Exposed Files & Code Cleanup", () => {
  describe("Item 6.1: Production Hardening Config & Logging Safety", () => {
    test("next.config.mjs disables poweredByHeader and productionBrowserSourceMaps", async () => {
      const nextConfigModule = await import("../next.config.mjs");
      const nextConfig = nextConfigModule.default;
      assert.equal(nextConfig.poweredByHeader, false, "poweredByHeader must be false");
      assert.equal(nextConfig.productionBrowserSourceMaps, false, "productionBrowserSourceMaps must be false");
    });

    test("Application error boundary exists and does not render stack traces", () => {
      const errorBoundaryPath = path.resolve(process.cwd(), "src/app/error.tsx");
      assert.ok(fs.existsSync(errorBoundaryPath), "src/app/error.tsx must exist");
      const content = fs.readFileSync(errorBoundaryPath, "utf-8");
      assert.ok(!content.includes("error.stack"), "Error boundary must never render error.stack to users");
      assert.ok(content.includes("Something went wrong"), "Error boundary must show generic error message");
    });

    test("Password reset service does not log plaintext verification codes in production", () => {
      const servicePath = path.resolve(process.cwd(), "src/services/passwordReset.service.ts");
      const content = fs.readFileSync(servicePath, "utf-8");
      assert.ok(
        content.includes('process.env.NODE_ENV !== "production"'),
        "Password reset logging must be protected by NODE_ENV !== 'production'"
      );
      assert.ok(
        !content.includes("console.log(`[AUTH SECURITY] Password reset code for ${normEmail}: ${codeStr}"),
        "Must not log plaintext codeStr in unconditioned log statements"
      );
    });
  });

  describe("Item 6.2: Exposed Files & Public Directory Security", () => {
    test("Public directory contains only essential assets and zero backups/dumps", () => {
      const publicDir = path.resolve(process.cwd(), "public");
      const files = fs.readdirSync(publicDir);
      
      const dangerousExtensions = [".env", ".sql", ".zip", ".tar", ".gz", ".bak", ".pem", ".key", ".log", ".dump"];
      for (const file of files) {
        const lower = file.toLowerCase();
        for (const ext of dangerousExtensions) {
          assert.ok(
            !lower.endsWith(ext),
            `Public directory must not contain dangerous file ${file}`
          );
        }
      }
    });

    test("No debug, seed, or test API routes exist in production API folder", () => {
      const apiDir = path.resolve(process.cwd(), "src/app/api");
      const checkDangerousDir = (dir) => {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
          const lower = item.name.toLowerCase();
          assert.notEqual(lower, "debug", "Must not have /api/debug");
          assert.notEqual(lower, "seed", "Must not have /api/seed");
          assert.notEqual(lower, "test", "Must not have /api/test");
          if (item.isDirectory()) {
            checkDangerousDir(path.join(dir, item.name));
          }
        }
      };
      checkDangerousDir(apiDir);
    });
  });

  describe("Item 6.3: Unused Dependencies & Dead Configuration", () => {
    test("Package.json does not contain unused libraries", () => {
      const pkgPath = path.resolve(process.cwd(), "package.json");
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      assert.equal(pkg.dependencies["class-variance-authority"], undefined, "class-variance-authority must be removed");
      assert.equal(pkg.dependencies["date-fns"], undefined, "date-fns must be removed");
      assert.equal(pkg.dependencies["@types/qrcode"], undefined, "@types/qrcode must not be in runtime dependencies");
    });

    test("NextAuth does not expose hardcoded dummy credentials", () => {
      const authPath = path.resolve(process.cwd(), "src/lib/auth.ts");
      const content = fs.readFileSync(authPath, "utf-8");
      assert.ok(!content.includes('"dummy-fb-id"'), "Must not contain dummy Facebook ID");
      assert.ok(!content.includes('"dummy-client-id"'), "Must not contain dummy Google ID");
    });
  });

  describe("Item 6.4: robots.txt & Crawl Indexing Protection", () => {
    test("robots.txt does not leak internal /secure-admin or /partner-hub paths", async () => {
      const robotsModule = await import("../src/app/robots.ts");
      const robotsFn = robotsModule.default;
      const robotsData = robotsFn();
      
      const disallowList = robotsData.rules[0]?.disallow || [];
      for (const rule of disallowList) {
        assert.ok(!rule.includes("secure-admin"), "robots.txt must not list secure-admin");
        assert.ok(!rule.includes("partner-hub"), "robots.txt must not list partner-hub");
      }
    });

    test("All administrative and private portals declare noindex", () => {
      const adminLayout = path.resolve(process.cwd(), "src/app/secure-admin/layout.tsx");
      const partnerLayout = path.resolve(process.cwd(), "src/app/partner-hub/layout.tsx");
      const accountLayout = path.resolve(process.cwd(), "src/app/account/layout.tsx");

      assert.ok(fs.readFileSync(adminLayout, "utf-8").includes("index: false"));
      assert.ok(fs.readFileSync(partnerLayout, "utf-8").includes("index: false"));
      assert.ok(fs.readFileSync(accountLayout, "utf-8").includes("index: false"));
    });
  });
});
