import type { FastifyInstance } from 'fastify';
import {
  requireAuthentication,
  requireTeacher
} from '../modules/auth/authGuards.js';
import * as scheduleController from '../modules/schedule/scheduleController.js';
import type {
  PaginationInput,
  ScheduleInput
} from '../modules/schedule/scheduleService.js';
import {
  createScheduleSchema,
  paginationSchema,
  scheduleParamsSchema,
  updateScheduleRouteSchema
} from '../modules/schedule/scheduleSchemas.js';

interface ScheduleParams {
  id: string;
}

export async function scheduleRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/schedule/teachers',
    { preHandler: requireTeacher },
    scheduleController.listTeachers
  );

  fastify.get(
    '/schedule',
    { preHandler: requireAuthentication },
    scheduleController.list
  );

  fastify.get<{ Querystring: PaginationInput }>(
    '/schedule/paginated',
    {
      schema: paginationSchema,
      preHandler: requireAuthentication
    },
    scheduleController.listPaginated
  );

  fastify.get<{ Params: ScheduleParams }>(
    '/schedule/:id',
    {
      schema: scheduleParamsSchema,
      preHandler: requireAuthentication
    },
    scheduleController.getById
  );

  fastify.post<{ Body: ScheduleInput }>(
    '/schedule',
    {
      schema: createScheduleSchema,
      preHandler: requireTeacher
    },
    scheduleController.create
  );

  fastify.put<{
    Params: ScheduleParams;
    Body: Partial<ScheduleInput>;
  }>(
    '/schedule/:id',
    {
      schema: updateScheduleRouteSchema,
      preHandler: requireTeacher
    },
    scheduleController.update
  );

  fastify.delete<{ Params: ScheduleParams }>(
    '/schedule/:id',
    {
      schema: scheduleParamsSchema,
      preHandler: requireTeacher
    },
    scheduleController.remove
  );
}
