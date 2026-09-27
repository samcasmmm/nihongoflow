import { describe, it, expect } from "bun:test";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resetPasswordSchema,
} from "@/modules/auth/validations";

describe("Auth Validation Schemas", () => {
  it("accepts valid registration input", () => {
    const valid = {
      email: "test@example.com",
      password: "securePassword123",
      name: "Taro",
    };
    const res = registerSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("rejects registration with invalid email or short password", () => {
    const invalidEmail = registerSchema.safeParse({
      email: "not-an-email",
      password: "securePassword123",
    });
    expect(invalidEmail.success).toBe(false);

    const shortPassword = registerSchema.safeParse({
      email: "test@example.com",
      password: "short",
    });
    expect(shortPassword.success).toBe(false);
  });

  it("validates login inputs correctly", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "pwd" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "invalid", password: "pwd" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });

  it("validates verify email and reset schemas", () => {
    expect(verifyEmailSchema.safeParse({ token: "abc-123" }).success).toBe(true);
    expect(verifyEmailSchema.safeParse({ token: "" }).success).toBe(false);

    expect(
      resetPasswordSchema.safeParse({ token: "token123", password: "newSecurePassword123" }).success
    ).toBe(true);
    expect(
      resetPasswordSchema.safeParse({ token: "token123", password: "short" }).success
    ).toBe(false);
  });
});
