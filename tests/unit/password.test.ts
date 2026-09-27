import { describe, it, expect } from "bun:test";
import { hashPassword, verifyPassword } from "@/modules/auth/utils/password";

describe("Password utilities", () => {
  it("hashes password and verifies match correctly", async () => {
    const raw = "SuperSecretP@ss123";
    const hashed = await hashPassword(raw);

    expect(hashed).toBeDefined();
    expect(hashed).not.toBe(raw);

    const matches = await verifyPassword(raw, hashed);
    expect(matches).toBe(true);
  });

  it("fails verification for mismatched passwords", async () => {
    const raw = "CorrectPassword123";
    const hashed = await hashPassword(raw);

    const matches = await verifyPassword("WrongPassword456", hashed);
    expect(matches).toBe(false);
  });
});
