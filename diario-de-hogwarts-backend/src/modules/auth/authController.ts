import type {
    FastifyReply,
    FastifyRequest
} from 'fastify';
import * as authService from './authService.js';
import type {
    AuthenticatedUser,
    LoginInput,
    RegisterUserInput
} from './authTypes.js';
import {
    AccountConflictError,
    AccountInputError
} from './authErrors.js';

export async function login(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
) {
    const user = await authService.authenticateUser(request.body);

    if (!user) {
        return reply.status(401).send({
            error: 'E-mail ou senha inválidos.'
        });
    }

    request.session.regenerate();
    request.session.set('user', user);

    return reply.status(200).send({ user });
}

export async function me(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const user = request.session.get('user') as
        | AuthenticatedUser
        | undefined;

    if (!user) {
        return reply.status(401).send({
            error: 'Sessão não autenticada.'
        });
    }

    return reply.status(200).send({ user });
}

export async function logout(
    request: FastifyRequest,
    reply: FastifyReply
) {
    request.session.delete();
    return reply.status(204).send();
}

export async function registerUser(
    request: FastifyRequest<{ Body: RegisterUserInput }>,
    reply: FastifyReply
) {
    try {
        const user = await authService.registerUser(request.body);
        return reply.status(201).send({ user });
    } catch (error) {
        if (error instanceof AccountConflictError) {
            return reply.status(409).send({ error: error.message });
        }

        if (error instanceof AccountInputError) {
            return reply.status(400).send({ error: error.message });
        }

        throw error;
    }
}
