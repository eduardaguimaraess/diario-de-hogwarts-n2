import type { ScheduleClass } from '../../data/scheduleData.js';
import { recordScheduleHistory } from '../scheduleHistory/scheduleHistoryRepository.js';
import * as scheduleRepository from './scheduleRepository.js';

export interface ScheduleInput {
  subject: string;
  professor: string;
  classroom: string;
  time: string;
  dayOfWeek: string;
}

export interface PaginationInput {
  page: number;
  limit: number;
  search: string;
}

export async function listSchedule(): Promise<ScheduleClass[]> {
  return scheduleRepository.findAll();
}

export async function listSchedulePaginated(input: PaginationInput) {
  const result = await scheduleRepository.findPaginated(
    input.page,
    input.limit,
    input.search
  );

  return {
    data: result.data,
    total: result.total,
    page: input.page,
    limit: input.limit,
    totalPages: Math.ceil(result.total / input.limit)
  };
}

export async function getScheduleById(
  id: string
): Promise<ScheduleClass | undefined> {
  return scheduleRepository.findById(id);
}

export async function createSchedule(
  input: ScheduleInput
): Promise<ScheduleClass> {
  const newClass: ScheduleClass = {
    id: Date.now().toString(),
    ...input
  };

  const createdClass = await scheduleRepository.create(newClass);

  await recordScheduleHistory({
    scheduleId: createdClass.id,
    action: 'created',
    snapshot: createdClass
  });

  return createdClass;
}

export async function updateSchedule(
  id: string,
  input: Partial<ScheduleInput>
): Promise<ScheduleClass | undefined> {
  const currentClass = await scheduleRepository.findById(id);

  if (!currentClass) {
    return undefined;
  }

  const updatedClass: ScheduleClass = {
    ...currentClass,
    ...input,
    id
  };

  const savedClass = await scheduleRepository.update(id, updatedClass);

  if (!savedClass) {
    return undefined;
  }

  await recordScheduleHistory({
    scheduleId: savedClass.id,
    action: 'updated',
    snapshot: savedClass
  });

  return savedClass;
}

export async function deleteSchedule(
  id: string
): Promise<ScheduleClass | undefined> {
  const currentClass = await scheduleRepository.findById(id);

  if (!currentClass) {
    return undefined;
  }

  const removed = await scheduleRepository.remove(id);

  if (!removed) {
    return undefined;
  }

  await recordScheduleHistory({
    scheduleId: currentClass.id,
    action: 'deleted',
    snapshot: currentClass
  });

  return currentClass;
}