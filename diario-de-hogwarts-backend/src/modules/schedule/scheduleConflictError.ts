export class ScheduleConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScheduleConflictError';
  }
}
