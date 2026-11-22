import type {
  FastifyReply,
  FastifyRequest
} from 'fastify';
import * as scheduleService from '../schedule/scheduleService.js';
import { ScheduleConflictError } from '../schedule/scheduleConflictError.js';
import type {
  PaginationInput,
  ScheduleInput
} from '../schedule/scheduleService.js';

interface Params {
  id: string;
}

export async function list(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const classes = await scheduleService.listSchedule();
  return reply.status(200).send(classes);
}

export async function listPaginated(
  request: FastifyRequest<{ Querystring: PaginationInput }>,
  reply: FastifyReply
) {
  const result = await scheduleService.listSchedulePaginated(request.query);
  return reply.status(200).send(result);
}

export async function getById(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  const item = await scheduleService.getScheduleById(request.params.id);

  if (!item) {
    return reply
      .status(404)
      .send({ error: 'Aula não encontrada na grade curricular de Hogwarts.' });
  }

  return reply.status(200).send(item);
}

export async function create(
  request: FastifyRequest<{ Body: ScheduleInput }>,
  reply: FastifyReply
) {
  try {
    const newClass = await scheduleService.createSchedule(request.body);
    return reply.status(201).send(newClass);
  } catch (error) {
    if (error instanceof ScheduleConflictError) {
      return reply.status(409).send({ error: error.message });
    }

    throw error;
  }
}

export async function update(
  request: FastifyRequest<{
    Params: Params;
    Body: Partial<ScheduleInput>;
  }>,
  reply: FastifyReply
) {
  let updatedClass: Awaited<
    ReturnType<typeof scheduleService.updateSchedule>
  >;

  try {
    updatedClass = await scheduleService.updateSchedule(
      request.params.id,
      request.body
    );
  } catch (error) {
    if (error instanceof ScheduleConflictError) {
      return reply.status(409).send({ error: error.message });
    }

    throw error;
  }

  if (!updatedClass) {
    return reply
      .status(404)
      .send({ error: 'Aula não encontrada para atualização.' });
  }

  return reply.status(200).send(updatedClass);
}

export async function remove(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  const removedClass = await scheduleService.deleteSchedule(
    request.params.id
  );

  if (!removedClass) {
    return reply
      .status(404)
      .send({ error: 'Aula não encontrada para remoção.' });
  }

  return reply.status(204).send();
}
