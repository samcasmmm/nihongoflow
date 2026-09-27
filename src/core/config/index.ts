export const config = {
  db: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/nihongoflow",
  },
  auth: {
    secret: process.env.AUTH_SECRET || "fallback-secret-at-least-32-chars-long-nihongoflow",
    sessionCookieName: "nihongoflow_session",
    sessionDurationSeconds: 60 * 60 * 24 * 7, // 7 days
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  email: {
    from: process.env.EMAIL_FROM || "noreply@nihongoflow.local",
    resendApiKey: process.env.RESEND_API_KEY || "",
  },
  swot: {
    // Configurable thresholds as mandated by AGENTS.md §5.4
    strengthThreshold: 0.8, // 80%+ accuracy
    opportunityThreshold: 0.6, // 60-79% accuracy
    weaknessThreshold: 0.6, // < 60% accuracy
    minAttemptsForEvaluation: 3,
  },
};
