import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { config } from "@/core/config";

export interface SessionPayload {
  userId: string;
  email: string;
  name?: string | null;
  emailVerified: boolean;
  expiresAt?: number;
}

const secretKey = new TextEncoder().encode(config.auth.secret);

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${config.auth.sessionDurationSeconds}s`)
    .sign(secretKey);
}

export async function decryptSession(sessionToken: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(sessionToken, secretKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSessionCookie(payload: SessionPayload) {
  const token = await encryptSession(payload);
  try {
    const cookieStore = await cookies();
    cookieStore.set(config.auth.sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: config.auth.sessionDurationSeconds,
    });
  } catch {
    // Graceful fallback when executed in non-request environment (e.g. tests, scripts)
  }

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(config.auth.sessionCookieName)?.value;
    if (!token) return null;

    return decryptSession(token);
  } catch {
    return null;
  }
}

export async function destroySessionCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(config.auth.sessionCookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  } catch {
    // Non-request environment
  }
}
