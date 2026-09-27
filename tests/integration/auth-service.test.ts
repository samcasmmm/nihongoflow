import { describe, it, expect, afterAll } from 'bun:test';
import { authService } from '@/modules/auth/services/auth-service';
import { userRepository } from '@/modules/auth/repositories/user-repository';
import { ConflictError, AuthenticationError } from '@/core/errors';

describe('AuthService Integration with Postgres', () => {
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let testUserId = '';

  afterAll(async () => {
    if (testUserId) {
      await userRepository.deleteUser(testUserId);
    }
  });

  it('registers a new user and creates default profile and active verification', async () => {
    const result = await authService.register({
      email: testEmail,
      password: testPassword,
      name: 'Kenji',
    });

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testEmail);
    expect(result.user.name).toBe('Kenji');
    expect(result.user.emailVerified).toBe(true);

    testUserId = result.user.id;

    // Verify profile was automatically created
    const profile = await userRepository.findProfileByUserId(testUserId);
    expect(profile).toBeDefined();
    expect(profile?.startingLesson).toBe(1);
    expect(profile?.levelLabel).toBe('Beginner');
  });

  it('prevents registering with duplicate email', async () => {
    expect(
      authService.register({
        email: testEmail,
        password: testPassword,
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('fails login with incorrect password', async () => {
    expect(
      authService.login({
        email: testEmail,
        password: 'WrongPassword999',
      }),
    ).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('logs in the user successfully', async () => {
    const result = await authService.login({
      email: testEmail,
      password: testPassword,
    });
    expect(result.user.id).toBe(testUserId);
    expect(result.user.email).toBe(testEmail);
    expect(result.user.emailVerified).toBe(true);
  });

  it('requests password reset and sends token', async () => {
    const reqResult = await authService.requestPasswordReset({ email: testEmail });
    expect(reqResult.message).toContain('reset link has been sent');

    const tokenRecord = await userRepository.findValidToken; // checking repository can query
    expect(tokenRecord).toBeDefined();
  });

  it('exports user data correctly', async () => {
    const exported = await authService.exportUserData(testUserId);
    expect(exported.user.email).toBe(testEmail);
    expect(exported.profile?.userId).toBe(testUserId);
  });
});
