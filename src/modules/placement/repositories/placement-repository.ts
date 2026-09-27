import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { profiles, Profile } from "@/db/schema/users";

export class PlacementRepository {
  async updateStartingLevel(
    userId: string,
    startingLesson: number,
    levelLabel: string
  ): Promise<Profile | null> {
    const [updated] = await db
      .update(profiles)
      .set({
        startingLesson,
        levelLabel,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning();

    return updated || null;
  }

  async getProfileByUserId(userId: string): Promise<Profile | null> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    return profile || null;
  }
}

export const placementRepository = new PlacementRepository();
