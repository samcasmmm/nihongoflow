import { db } from "@/db/client";
import { gamificationState, xpEvents, activeMissions } from "@/db/schema";
import { eq, and, sql, gte } from "drizzle-orm";

export const gamificationRepository = {
  async getOrCreateState(userId: string) {
    let state = await db.query.gamificationState.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });

    if (!state) {
      try {
        const [created] = await db
          .insert(gamificationState)
          .values({
            userId,
            totalXp: 0,
            currentStreak: 0,
            longestStreak: 0,
            streakFreezesAvailable: 1,
            dailyGoalXp: 10,
          })
          .onConflictDoNothing()
          .returning();
        state = created || (await db.query.gamificationState.findFirst({
          where: (table, { eq }) => eq(table.userId, userId),
        }));
      } catch (err) {
        state = await db.query.gamificationState.findFirst({
          where: (table, { eq }) => eq(table.userId, userId),
        });
        if (!state) throw err;
      }
    }

    return state;
  },

  async addXp(userId: string, amount: number, source: string, entityId?: string) {
    // 1. Record event
    await db.insert(xpEvents).values({
      userId,
      amount,
      source,
      entityId,
    });

    // 2. Increment state
    const [updated] = await db
      .update(gamificationState)
      .set({
        totalXp: sql`${gamificationState.totalXp} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(gamificationState.userId, userId))
      .returning();

    return updated;
  },

  async recordActivityAndTickStreak(userId: string) {
    const state = await this.getOrCreateState(userId);
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (state.lastActivityDate === today) {
      // Already ticked today
      return state;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    let newStreak = state.currentStreak;
    let freezes = state.streakFreezesAvailable;

    if (!state.lastActivityDate) {
      // First activity
      newStreak = 1;
    } else if (state.lastActivityDate === yesterday) {
      // Perfect continuity
      newStreak = state.currentStreak + 1;
    } else {
      // Missed at least one calendar day
      if (freezes > 0) {
        // Automatically consume a freeze buffer (Zero Dark Patterns / No shame!)
        freezes -= 1;
        newStreak = state.currentStreak + 1;
      } else {
        // Reset streak to 1 gently
        newStreak = 1;
      }
    }

    const longest = Math.max(state.longestStreak, newStreak);

    const [updated] = await db
      .update(gamificationState)
      .set({
        currentStreak: newStreak,
        longestStreak: longest,
        lastActivityDate: today,
        streakFreezesAvailable: freezes,
        updatedAt: new Date(),
      })
      .where(eq(gamificationState.userId, userId))
      .returning();

    return updated;
  },

  async getDailyEarnedXp(userId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const events = await db
      .select({ total: sql<number>`COALESCE(SUM(${xpEvents.amount}), 0)` })
      .from(xpEvents)
      .where(and(eq(xpEvents.userId, userId), gte(xpEvents.createdAt, todayStart)));

    return Number(events[0]?.total || 0);
  },

  async getActiveMissions(userId: string) {
    return db.query.activeMissions.findMany({
      where: (table, { eq, and }) =>
        and(eq(table.userId, userId), eq(table.completed, false)),
    });
  },

  async createMission(userId: string, data: {
    type: string;
    targetTag: string;
    title: string;
    description: string;
    targetCount: number;
  }) {
    const [mission] = await db
      .insert(activeMissions)
      .values({
        userId,
        ...data,
      })
      .returning();
    return mission;
  },

  async incrementMissionProgress(userId: string, missionId: string) {
    const mission = await db.query.activeMissions.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.id, missionId), eq(table.userId, userId)),
    });

    if (!mission || mission.completed) return null;

    const nextCount = mission.currentCount + 1;
    const isCompleted = nextCount >= mission.targetCount;

    const [updated] = await db
      .update(activeMissions)
      .set({
        currentCount: nextCount,
        completed: isCompleted,
        resolvedAt: isCompleted ? new Date() : null,
      })
      .where(eq(activeMissions.id, missionId))
      .returning();

    return updated;
  },
};
