import * as scheduleHistoryRepository from './scheduleHistoryRepository.js';

const historyLimit = 50;

export async function listRecentScheduleHistory() {
    return scheduleHistoryRepository.findRecentScheduleHistory(historyLimit);
}