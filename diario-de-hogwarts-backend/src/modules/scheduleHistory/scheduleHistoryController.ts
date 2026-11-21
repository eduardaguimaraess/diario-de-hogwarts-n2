import type {
    FastifyReply,
    FastifyRequest
} from 'fastify';
import * as scheduleHistoryService from './scheduleHistoryService.js';

export async function listRecent(
    _request: FastifyRequest,
    reply: FastifyReply
) {
    const history = await scheduleHistoryService.listRecentScheduleHistory();

    return reply.status(200).send({
        data: history,
        total: history.length
    });
}