import { eq, and, gt } from "drizzle-orm";
import { db } from "@/db/client";
import {
  users,
  profiles,
  verificationTokens,
  User,
  NewUser,
  Profile,
  NewProfile,
  VerificationToken,
  NewVerificationToken,
} from "@/db/schema/users";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user || null;
  }

  async createUser(data: Omit<NewUser, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...data,
        email: data.email.toLowerCase().trim(),
      })
      .returning();
    return user;
  }

  async createProfile(data: Omit<NewProfile, "id" | "createdAt" | "updatedAt">): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(data).returning();
    return profile;
  }

  async findProfileByUserId(userId: string): Promise<Profile | null> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);
    return profile || null;
  }

  async updateEmailVerified(userId: string, emailVerified = true): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ emailVerified, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updatePassword(userId: string, passwordHash: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, userId)).returning();
    return result.length > 0;
  }

  async createVerificationToken(data: Omit<NewVerificationToken, "id" | "createdAt">): Promise<VerificationToken> {
    const [token] = await db.insert(verificationTokens).values(data).returning();
    return token;
  }

  async findValidToken(token: string, type: "verify_email" | "reset_password"): Promise<VerificationToken | null> {
    const [found] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, type),
          gt(verificationTokens.expiresAt, new Date())
        )
      )
      .limit(1);
    return found || null;
  }

  async deleteVerificationTokensByUserId(userId: string, type?: "verify_email" | "reset_password"): Promise<void> {
    if (type) {
      await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.userId, userId),
            eq(verificationTokens.type, type)
          )
        );
    } else {
      await db.delete(verificationTokens).where(eq(verificationTokens.userId, userId));
    }
  }

  async deleteTokenById(id: string): Promise<void> {
    await db.delete(verificationTokens).where(eq(verificationTokens.id, id));
  }
}

export const userRepository = new UserRepository();
