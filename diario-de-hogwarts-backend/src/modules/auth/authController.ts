import type {
    FastifyReply,
    FastifyRequest
} from 'fastify';
import * as authService from './authService.js';
import type {
    AuthenticatedUser,
    LoginInput
} from './authTypes.js';

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