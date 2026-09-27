import { pgTable, text, timestamp, boolean, uuid, integer, date } from "drizzle-orm/pg-core";
import { users } from "./users";

// Card Progress (Leitner Box 1..5 for Kana & Vocab)
export const cardProgress = pgTable("card_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  cardType: text("card_type").notNull(), // 'kana' | 'vocab'
  cardId: uuid("card_id").notNull(),
  box: integer("box").default(1).notNull(), // Leitner box 1 to 5
  timesReviewed: integer("times_reviewed").default(0).notNull(),
  timesCorrect: integer("times_correct").default(0).notNull(),
  lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
  nextReviewAt: timestamp("next_review_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Gamification State (Server-authoritative streaks, XP, freezes)
export const gamificationState = pgTable("gamification_state", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  totalXp: integer("total_xp").default(0).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastActivityDate: date("last_activity_date"), // YYYY-MM-DD
  streakFreezesAvailable: integer("streak_freezes_available").default(1).notNull(),
  lastFreezeUsedAt: timestamp("last_freeze_used_at", { withTimezone: true }),
  dailyGoalXp: integer("daily_goal_xp").default(10).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// XP Events (Ledger for XP audit, analytics, and rate-limiting)
export const xpEvents = pgTable("xp_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  source: text("source").notNull(), // 'card_review' | 'practice_item' | 'lesson_stage' | 'lesson_complete' | 'placement'
  entityId: text("entity_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Active Missions (Generated from SWOT Weaknesses or Threats)
export const activeMissions = pgTable("active_missions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'weakness_reinforce' | 'decay_refresh' | 'daily_goal'
  targetTag: text("target_tag").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetCount: integer("target_count").default(5).notNull(),
  currentCount: integer("current_count").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Lesson Progress (Module 7 3-Stage Stepper: Vocab -> Grammar -> Practice)
export const lessonProgress = pgTable("lesson_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lessonNumber: integer("lesson_number").notNull(),
  currentStage: text("current_stage").default("vocab").notNull(), // 'vocab' | 'grammar' | 'practice'
  vocabCompleted: boolean("vocab_completed").default(false).notNull(),
  grammarCompleted: boolean("grammar_completed").default(false).notNull(),
  practiceCompleted: boolean("practice_completed").default(false).notNull(),
  practiceScore: integer("practice_score").default(0).notNull(), // percentage 0..100
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CardProgress = typeof cardProgress.$inferSelect;
export type NewCardProgress = typeof cardProgress.$inferInsert;
export type GamificationState = typeof gamificationState.$inferSelect;
export type NewGamificationState = typeof gamificationState.$inferInsert;
export type XpEvent = typeof xpEvents.$inferSelect;
export type NewXpEvent = typeof xpEvents.$inferInsert;
export type ActiveMission = typeof activeMissions.$inferSelect;
export type NewActiveMission = typeof activeMissions.$inferInsert;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type NewLessonProgress = typeof lessonProgress.$inferInsert;
