import { withAuth } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { lessonRepository } from "@/modules/lessons/repositories/lesson-repository";
import { userRepository } from "@/modules/auth/repositories/user-repository";

export const GET = withAuth(async (_req, { session }) => {
  const allLessons = await lessonRepository.findAll();
  const profile = await userRepository.findProfileByUserId(session.userId);
  const startingLesson = profile?.startingLesson || 1;

  const lessonsWithStatus = allLessons.map((lesson) => {
    const isUnlocked = lesson.lessonNumber <= startingLesson;
    const isCurrent = lesson.lessonNumber === startingLesson;
    return {
      ...lesson,
      isUnlocked,
      isCurrent,
    };
  });

  return successResponse({
    startingLesson,
    lessons: lessonsWithStatus,
  });
});
