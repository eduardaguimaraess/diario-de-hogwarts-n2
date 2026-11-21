import type { FastifyInstance } from 'fastify';
import * as authController from './authController.js';
import { loginSchema } from './authSchemas.js';

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/auth/login',
        { schema: loginSchema },
        authController.login
    );

    fastify.get('/auth/me', authController.me);
    fastify.post('/auth/logout', authController.logout);
}