import argon2 from 'argon2';
import * as authRepository from './authRepository.js';
import type {
    AuthenticatedUser,
    LoginInput
} from './authTypes.js';

export async function authenticateUser(
    input: LoginInput
): Promise<AuthenticatedUser | null> {
    const email = input.email.trim().toLowerCase();
    const account = await authRepository.findUserByEmail(email);

    if (!account) {
        return null;
    }

    const passwordMatches = await argon2.verify(
        account.passwordHash,
        input.password
    );

    if (!passwordMatches) {
        return null;
    }

    return {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        house: account.house
    };
}