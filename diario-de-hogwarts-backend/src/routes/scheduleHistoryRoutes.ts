import type { FastifyInstance } from 'fastify';
import { requireTeacher } from '../modules/auth/authGuards.js';
import * as scheduleHistoryController from '../modules/scheduleHistory/scheduleHistoryController.js';

export async function scheduleHistoryRoutes(fastify: FastifyInstance) {
    fastify.get(
        '/schedule/history',
        { preHandler: requireTeacher },
        scheduleHistoryController.listRecent
    );
}