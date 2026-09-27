import crypto from 'crypto';
import { userRepository, UserRepository } from '../repositories/user-repository';
import { hashPassword, verifyPassword } from '../utils/password';
import {
  RegisterInput,
  LoginInput,
  VerifyEmailInput,
  RequestResetInput,
  ResetPasswordInput,
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  requestResetSchema,
  resetPasswordSchema,
} from '../validations';
import { SafeUser, AuthSessionData } from '../types';
import { ValidationError, ConflictError, AuthenticationError, NotFoundError } from '@/core/errors';
import { sendPasswordResetEmail } from '@/core/email';
import { createSessionCookie, destroySessionCookie, getSession } from '@/core/auth/session';
import { User } from '@/db/schema/users';

export class AuthService {
  constructor(private userRepo: UserRepository = userRepository) {}

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async register(rawInput: RegisterInput): Promise<{ user: SafeUser; profile: unknown }> {
    const parseResult = registerSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new ValidationError('Invalid registration data', parseResult.error.flatten());
    }

    const { email, password, name } = parseResult.data;

    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    const passwordHash = await hashPassword(password);
    const user = await this.userRepo.createUser({
      email,
      passwordHash,
      name: name || null,
      emailVerified: true,
    });

    // Create default profile for the user
    const profile = await this.userRepo.createProfile({
      userId: user.id,
      startingLesson: 1,
      levelLabel: 'Beginner',
      dailyGoalXp: 10,
    });

    const safeUser = this.toSafeUser(user);

    // Auto log in immediately upon registration
    await createSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      emailVerified: true,
      role: user.role,
    });

    return {
      user: safeUser,
      profile,
    };
  }

  async login(rawInput: LoginInput): Promise<AuthSessionData> {
    const parseResult = loginSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new ValidationError('Invalid login data', parseResult.error.flatten());
    }

    const { email, password } = parseResult.data;

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid email or password');
    }

    const profile = await this.userRepo.findProfileByUserId(user.id);
    const safeUser = this.toSafeUser(user);

    // Create session cookie
    await createSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      role: user.role,
    });

    return {
      user: safeUser,
      profile: profile || null,
    };
  }

  async logout(): Promise<void> {
    await destroySessionCookie();
  }

  async verifyEmail(rawInput: VerifyEmailInput): Promise<{ success: boolean; message: string }> {
    const parseResult = verifyEmailSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new ValidationError('Invalid verification token format');
    }

    const { token } = parseResult.data;
    const tokenRecord = await this.userRepo.findValidToken(token, 'verify_email');

    if (!tokenRecord) {
      throw new ValidationError('Invalid or expired verification token');
    }

    const updatedUser = await this.userRepo.updateEmailVerified(tokenRecord.userId, true);
    await this.userRepo.deleteTokenById(tokenRecord.id);

    // If active session belongs to this user, update the session cookie
    const currentSession = await getSession();
    if (currentSession && currentSession.userId === updatedUser.id) {
      await createSessionCookie({
        ...currentSession,
        emailVerified: true,
      });
    }

    return {
      success: true,
      message: 'Email verified successfully! You can now access all learning features.',
    };
  }

  async requestPasswordReset(rawInput: RequestResetInput): Promise<{ message: string }> {
    const parseResult = requestResetSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new ValidationError('Invalid email address');
    }

    const { email } = parseResult.data;
    const user = await this.userRepo.findByEmail(email);

    // Even if user not found, return vague success message to prevent user enumeration
    if (!user) {
      return { message: 'If an account exists with this email, a reset link has been sent.' };
    }

    // Invalidate existing reset tokens for this user
    await this.userRepo.deleteVerificationTokensByUserId(user.id, 'reset_password');

    // Generate reset token (valid for 1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.userRepo.createVerificationToken({
      userId: user.id,
      token,
      type: 'reset_password',
      expiresAt,
    });

    await sendPasswordResetEmail(user.email, token);

    return { message: 'If an account exists with this email, a reset link has been sent.' };
  }

  async resetPassword(rawInput: ResetPasswordInput): Promise<{ message: string }> {
    const parseResult = resetPasswordSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new ValidationError('Invalid password reset data', parseResult.error.flatten());
    }

    const { token, password } = parseResult.data;
    const tokenRecord = await this.userRepo.findValidToken(token, 'reset_password');

    if (!tokenRecord) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const newHash = await hashPassword(password);
    await this.userRepo.updatePassword(tokenRecord.userId, newHash);
    await this.userRepo.deleteTokenById(tokenRecord.id);

    return { message: 'Password updated successfully. You can now log in with your new password.' };
  }

  async getCurrentSessionUser(): Promise<AuthSessionData | null> {
    const session = await getSession();
    if (!session) return null;

    const user = await this.userRepo.findById(session.userId);
    if (!user) return null;

    const profile = await this.userRepo.findProfileByUserId(user.id);

    return {
      user: this.toSafeUser(user),
      profile: profile || null,
    };
  }

  async deleteAccount(userId: string): Promise<boolean> {
    const deleted = await this.userRepo.deleteUser(userId);
    if (deleted) {
      await destroySessionCookie();
    }
    return deleted;
  }

  async exportUserData(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const profile = await this.userRepo.findProfileByUserId(userId);

    return {
      user: this.toSafeUser(user),
      profile,
      exportedAt: new Date().toISOString(),
    };
  }
}

export const authService = new AuthService();
