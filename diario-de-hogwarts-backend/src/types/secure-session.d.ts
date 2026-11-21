import '@fastify/secure-session';
import type { AuthenticatedUser } from '../modules/auth/authTypes.js';

declare module '@fastify/secure-session' {
    interface SessionData {
        user: AuthenticatedUser;
    }
}