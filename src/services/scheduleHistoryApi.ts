import type { ScheduleClass } from '../types/hogwarts';

const BACKEND_URL = 'http://localhost:3333';

export type ScheduleHistoryAction = 'created' | 'updated' | 'deleted';

export interface ScheduleHistoryItem {
    id: string;
    scheduleId: string;
    action: ScheduleHistoryAction;
    snapshot: ScheduleClass;
    occurredAt: string;
}

export interface ScheduleHistoryResponse {
    data: ScheduleHistoryItem[];
    total: number;
}

export async function getScheduleHistory(): Promise<ScheduleHistoryResponse> {
    const response = await fetch(`${BACKEND_URL}/schedule/history`, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Não foi possível carregar o histórico das aulas.');
    }

    return response.json();
}