import argon2 from 'argon2';
import * as authRepository from './authRepository.js';
import {
    AccountConflictError,
    AccountInputError
} from './authErrors.js';
import type {
    AuthenticatedUser,
    LoginInput,
    RegisterUserInput
} from './authTypes.js';

function isDuplicateEntryError(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'ER_DUP_ENTRY'
    );
}

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

export async function registerUser(
    input: RegisterUserInput
): Promise<AuthenticatedUser> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (name.length < 2) {
        throw new AccountInputError('Informe o nome completo do usuário.');
    }

    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
        throw new AccountConflictError(
            'Já existe uma conta cadastrada com esse e-mail.'
        );
    }

    const passwordHash = await argon2.hash(input.password);
    let id: number;

    try {
        id = await authRepository.insertUser({
            name,
            email,
            passwordHash,
            role: input.role,
            house: input.house
        });
    } catch (error) {
        if (isDuplicateEntryError(error)) {
            throw new AccountConflictError(
                'Já existe uma conta cadastrada com esse e-mail.'
            );
        }

        throw error;
    }

    return {
        id,
        name,
        email,
        role: input.role,
        house: input.house
    };
}
