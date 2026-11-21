export type UserRole = 'student' | 'teacher';

export interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    house: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

const BACKEND_URL = 'http://localhost:3333';

interface AuthResponse {
    user: AuthenticatedUser;
}

async function getErrorMessage(
    response: Response,
    fallback: string
): Promise<string> {
    try {
        const body = (await response.json()) as { error?: string };
        return body.error || fallback;
    } catch {
        return fallback;
    }
}

export async function loginRequest(
    credentials: LoginCredentials
): Promise<AuthenticatedUser> {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, 'Não foi possível realizar o login.')
        );
    }

    const result = (await response.json()) as AuthResponse;
    return result.user;
}

export async function getCurrentUser(): Promise<AuthenticatedUser> {
    const response = await fetch(`${BACKEND_URL}/auth/me`, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, 'Sessão não autenticada.')
        );
    }

    const result = (await response.json()) as AuthResponse;
    return result.user;
}

export async function logoutRequest(): Promise<void> {
    const response = await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Não foi possível encerrar a sessão.');
    }
}