export interface SeedUserData {
  email: string;
  name: string;
  role: "admin" | "user";
  passwordPlain: string;
  startingLesson: number;
  levelLabel: string;
  dailyGoalXp: number;
}

export const USERS_DATA: SeedUserData[] = [
  {
    email: "admin@mail.com",
    name: "Admin CMS",
    role: "admin",
    passwordPlain: "Password123!",
    startingLesson: 5,
    levelLabel: "Advanced",
    dailyGoalXp: 50,
  },
  {
    email: "sameer@mail.com",
    name: "Sameer",
    role: "user",
    passwordPlain: "Password123!",
    startingLesson: 1,
    levelLabel: "Beginner",
    dailyGoalXp: 15,
  },
  {
    email: "ninad@mail.com",
    name: "Ninad",
    role: "user",
    passwordPlain: "Password123!",
    startingLesson: 2,
    levelLabel: "Beginner",
    dailyGoalXp: 20,
  },
];
