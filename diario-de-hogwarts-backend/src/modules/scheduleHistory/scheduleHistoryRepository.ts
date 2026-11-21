import type { ScheduleClass } from '../../data/scheduleData.js';
import { connectMongo } from '../../database/mongodbConnection.js';

export type ScheduleHistoryAction = 'created' | 'updated' | 'deleted';

export interface ScheduleHistoryInput {
  scheduleId: string;
  action: ScheduleHistoryAction;
  snapshot: ScheduleClass;
}

interface ScheduleHistoryDocument extends ScheduleHistoryInput {
  occurredAt: Date;
}

export interface ScheduleHistoryItem extends ScheduleHistoryDocument {
  id: string;
}

const collectionName = 'schedule_history';

export async function recordScheduleHistory(
  input: ScheduleHistoryInput
): Promise<void> {
  const mongoDatabase = await connectMongo();
  const collection =
    mongoDatabase.collection<ScheduleHistoryDocument>(collectionName);

  await collection.insertOne({
    ...input,
    occurredAt: new Date()
  });
}

export async function findRecentScheduleHistory(
  limit = 50
): Promise<ScheduleHistoryItem[]> {
  const mongoDatabase = await connectMongo();
  const collection =
    mongoDatabase.collection<ScheduleHistoryDocument>(collectionName);

  const documents = await collection
    .find({})
    .sort({ occurredAt: -1 })
    .limit(limit)
    .toArray();

  return documents.map(({ _id, ...document }) => ({
    ...document,
    id: _id.toHexString()
  }));
}