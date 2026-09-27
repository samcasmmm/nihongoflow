import { db } from "@/db/client";
import { lessons } from "@/db/schema";
import { asc } from "drizzle-orm";

export const lessonRepository = {
  async findAll() {
    return db.query.lessons.findMany({
      orderBy: [asc(lessons.lessonNumber)],
    });
  },

  async findByNumber(lessonNumber: number) {
    return db.query.lessons.findFirst({
      where: (table, { eq }) => eq(table.lessonNumber, lessonNumber),
    });
  },
};
