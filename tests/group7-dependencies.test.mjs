import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

describe("GROUP 7: Dependency Security & Version Pinning", () => {
  test("Dependencies in package.json are strictly pinned to exact versions", () => {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

    const checkPinned = (deps, section) => {
      for (const [name, version] of Object.entries(deps || {})) {
        assert.ok(
          !version.startsWith("^") && !version.startsWith("~"),
          `Package "${name}" in ${section} must be pinned to exact version, got "${version}"`
        );
      }
    };

    checkPinned(pkg.dependencies, "dependencies");
    checkPinned(pkg.devDependencies, "devDependencies");
  });

  test("Next.js is pinned to 14.2.35 (latest patched 14.2.x security release)", () => {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    assert.equal(pkg.dependencies.next, "14.2.35");
  });

  test("NextAuth is pinned to 4.24.15 (latest patched 4.x LTS release)", () => {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    assert.equal(pkg.dependencies["next-auth"], "4.24.15");
  });

  test("Prisma is pinned to 5.22.0 (latest stable 5.x release)", () => {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    assert.equal(pkg.dependencies["@prisma/client"], "5.22.0");
    assert.equal(pkg.devDependencies.prisma, "5.22.0");
  });

  test("Dependabot automated security configuration exists and is valid", () => {
    const dependabotPath = path.resolve(process.cwd(), ".github/dependabot.yml");
    assert.ok(fs.existsSync(dependabotPath), ".github/dependabot.yml must exist");
    const content = fs.readFileSync(dependabotPath, "utf-8");
    assert.ok(content.includes('package-ecosystem: "npm"'), "Dependabot must monitor npm");
    assert.ok(content.includes('interval: "weekly"'), "Dependabot must run on schedule");
  });
});
