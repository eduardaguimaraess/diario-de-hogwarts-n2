import type { FastifyInstance } from 'fastify';
import * as authController from './authController.js';
import { requireTeacher } from './authGuards.js';
import { loginSchema, registerUserSchema } from './authSchemas.js';
import type { RegisterUserInput } from './authTypes.js';

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/auth/login',
        { schema: loginSchema },
        authController.login
    );

    fastify.get('/auth/me', authController.me);
    fastify.post('/auth/logout', authController.logout);

    fastify.post<{ Body: RegisterUserInput }>(
        '/auth/users',
        {
            schema: registerUserSchema,
            preHandler: requireTeacher
        },
        authController.registerUser
    );
}
