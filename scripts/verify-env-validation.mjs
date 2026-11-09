import assert from "node:assert/strict";

console.log("=== TESTING ZOD STARTUP ENV VALIDATION ===");

// 1. Test that invalid/weak NEXTAUTH_SECRET throws at startup / import time in production
{
  const origEnv = { ...process.env };
  try {
    process.env.NODE_ENV = "production";
    process.env.DATABASE_URL = "postgresql://user:pass@ep-test.neon.tech/neondb";
    process.env.NEXTAUTH_SECRET = "super-secret-random-key-change-in-production"; // known weak placeholder
    
    await assert.rejects(
      async () => {
        await import(`../src/lib/env.ts?t=${Date.now()}-1`);
      },
      /FATAL:[\s\S]*NEXTAUTH_SECRET/
    );
    console.log("✔ PASS: Throws fatal error when NEXTAUTH_SECRET is weak placeholder in production");
  } finally {
    process.env = origEnv;
  }
}

// 2. Test that short NEXTAUTH_SECRET throws at startup in production
{
  const origEnv = { ...process.env };
  try {
    process.env.NODE_ENV = "production";
    process.env.DATABASE_URL = "postgresql://user:pass@ep-test.neon.tech/neondb";
    process.env.NEXTAUTH_SECRET = "short-secret"; // < 32 chars
    
    await assert.rejects(
      async () => {
        await import(`../src/lib/env.ts?t=${Date.now()}-2`);
      },
      /FATAL:[\s\S]*NEXTAUTH_SECRET/
    );
    console.log("✔ PASS: Throws fatal error when NEXTAUTH_SECRET is shorter than 32 chars in production");
  } finally {
    process.env = origEnv;
  }
}

// 3. Test that sensitive NEXT_PUBLIC_* variable throws immediately
{
  const origEnv = { ...process.env };
  try {
    process.env.NEXT_PUBLIC_DATABASE_PASSWORD = "npg_fakeSecretPassword123";
    
    await assert.rejects(
      async () => {
        await import(`../src/lib/env.ts?t=${Date.now()}-3`);
      },
      /SECURITY CRITICAL: Public client environment variable.*contains sensitive keywords/
    );
    console.log("✔ PASS: Throws critical security error when a secret is prefixed with NEXT_PUBLIC_");
  } finally {
    process.env = origEnv;
  }
}

console.log("All environment validation test assertions passed successfully!");
