import type {
    FastifyReply,
    FastifyRequest
} from 'fastify';
import type { AuthenticatedUser } from './authTypes.js';

function getSessionUser(
    request: FastifyRequest
): AuthenticatedUser | undefined {
    return request.session.get('user') as
        | AuthenticatedUser
        | undefined;
}

export async function requireAuthentication(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const user = getSessionUser(request);

    if (!user) {
        return reply.status(401).send({
            error: 'Faça login para acessar este recurso.'
        });
    }
}

export async function requireTeacher(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const user = getSessionUser(request);

    if (!user) {
        return reply.status(401).send({
            error: 'Faça login para acessar este recurso.'
        });
    }

    if (user.role !== 'teacher') {
        return reply.status(403).send({
            error: 'Apenas professores podem realizar esta operação.'
        });
    }
}