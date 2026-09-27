export interface SafeUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  startingLesson: number;
  levelLabel: string;
  dailyGoalXp: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSessionData {
  user: SafeUser;
  profile: UserProfile | null;
}
