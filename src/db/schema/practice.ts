import { pgTable, text, timestamp, boolean, uuid, integer } from "drizzle-orm/pg-core";
import { users } from "./users";
import { sentenceItems } from "./content";

// Practice Sessions (Module 8)
export const practiceSessions = pgTable("practice_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lessonNumber: integer("lesson_number").notNull(),
  totalItems: integer("total_items").default(5).notNull(),
  completedItems: integer("completed_items").default(0).notNull(),
  correctCount: integer("correct_count").default(0).notNull(),
  score: integer("score").default(0).notNull(), // percentage 0..100
  status: text("status").default("in_progress").notNull(), // 'in_progress' | 'completed'
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Attempts (Module 8 attempt recording with error tags)
export const attempts = pgTable("attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => practiceSessions.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sentenceItemId: uuid("sentence_item_id")
    .notNull()
    .references(() => sentenceItems.id, { onDelete: "cascade" }),
  userAnswer: text("user_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  errorTag: text("error_tag"), // e.g. 'particle_wa_ga', 'copula_mismatch', or null if correct
  feedback: text("feedback"),
  responseTimeMs: integer("response_time_ms").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type PracticeSession = typeof practiceSessions.$inferSelect;
export type NewPracticeSession = typeof practiceSessions.$inferInsert;
export type Attempt = typeof attempts.$inferSelect;
export type NewAttempt = typeof attempts.$inferInsert;
