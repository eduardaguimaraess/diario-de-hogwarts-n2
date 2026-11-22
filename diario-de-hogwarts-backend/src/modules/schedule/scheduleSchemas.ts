const scheduleIdParams = {
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
      pattern: '^[0-9]+$'
    }
  }
} as const;

export const scheduleParamsSchema = {
  params: scheduleIdParams
} as const;

export const createScheduleSchema = {
  body: {
    type: 'object',
    required: ['subject', 'teacherId', 'classroom', 'time', 'dayOfWeek'],
    additionalProperties: false,
    properties: {
      subject: { type: 'string', minLength: 1, maxLength: 100 },
      teacherId: { type: 'integer', minimum: 1 },
      classroom: { type: 'string', minLength: 1, maxLength: 100 },
      time: { type: 'string', minLength: 1, maxLength: 30 },
      dayOfWeek: { type: 'string', minLength: 1, maxLength: 30 }
    }
  }
} as const;

export const updateScheduleSchema = {
  body: {
    type: 'object',
    minProperties: 1,
    additionalProperties: false,
    properties: {
      subject: { type: 'string', minLength: 1, maxLength: 100 },
      teacherId: { type: 'integer', minimum: 1 },
      classroom: { type: 'string', minLength: 1, maxLength: 100 },
      time: { type: 'string', minLength: 1, maxLength: 30 },
      dayOfWeek: { type: 'string', minLength: 1, maxLength: 30 }
    }
  }
} as const;

export const updateScheduleRouteSchema = {
  params: scheduleIdParams,
  body: updateScheduleSchema.body
} as const;

export const paginationSchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      limit: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
      search: { type: 'string', maxLength: 100, default: '' }
    },
    additionalProperties: false
  }
} as const;
