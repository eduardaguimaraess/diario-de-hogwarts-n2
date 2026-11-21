import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import {
    AlertTriangle,
    CalendarDays,
    Clock3,
    History,
    Loader2,
    MapPin,
    RefreshCw,
    UserRound
} from 'lucide-react';
import {
    getScheduleHistory,
    type ScheduleHistoryAction,
    type ScheduleHistoryItem
} from '../services/scheduleHistoryApi';

const actionDisplay: Record<
    ScheduleHistoryAction,
    { label: string; color: string; background: string }
> = {
    created: {
        label: 'Aula criada',
        color: '#86efac',
        background: 'rgba(34, 197, 94, 0.14)'
    },
    updated: {
        label: 'Aula atualizada',
        color: '#93c5fd',
        background: 'rgba(59, 130, 246, 0.14)'
    },
    deleted: {
        label: 'Aula excluída',
        color: '#fca5a5',
        background: 'rgba(239, 68, 68, 0.14)'
    }
};

function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(date);
}

export function ScheduleHistory() {
    const [history, setHistory] = useState<ScheduleHistoryItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function loadHistory() {
            try {
                setLoading(true);
                setError(null);

                const response = await getScheduleHistory();

                if (!cancelled) {
                    setHistory(response.data);
                    setTotal(response.total);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Ocorreu um erro ao carregar o histórico.'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadHistory();

        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    const buttonStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.65rem 0.9rem',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        color: '#fff',
        backgroundColor: 'var(--color-navy)',
        cursor: 'pointer',
        fontWeight: 600
    };

    return (
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
            <header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginBottom: '1.5rem'
                }}
            >
                <div>
                    <h1
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            margin: 0,
                            color: '#fff',
                            fontSize: '1.8rem'
                        }}
                    >
                        <History color="var(--color-lavender)" size={25} />
                        Histórico de aulas
                    </h1>

                    <p
                        style={{
                            marginTop: '0.5rem',
                            color: 'var(--color-lavender)',
                            fontSize: '0.9rem'
                        }}
                    >
                        Registro das criações, alterações e exclusões armazenado no MongoDB.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setReloadKey((current) => current + 1)}
                    disabled={loading}
                    style={{
                        ...buttonStyle,
                        opacity: loading ? 0.65 : 1
                    }}
                >
                    <RefreshCw size={16} />
                    Atualizar
                </button>
            </header>

            {!loading && !error && (
                <p style={{ color: 'var(--color-lavender)', marginBottom: '1rem' }}>
                    {total} {total === 1 ? 'registro encontrado' : 'registros encontrados'}.
                </p>
            )}

            {loading && (
                <div
                    role="status"
                    style={{
                        padding: '3rem',
                        textAlign: 'center',
                        color: 'var(--color-lavender)'
                    }}
                >
                    <Loader2 size={30} className="animate-spin" />
                    <p>Carregando histórico...</p>
                </div>
            )}

            {!loading && error && (
                <div
                    role="alert"
                    style={{
                        padding: '2rem',
                        textAlign: 'center',
                        border: '1px solid rgba(239, 68, 68, 0.45)',
                        borderRadius: '12px',
                        color: '#fca5a5',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)'
                    }}
                >
                    <AlertTriangle size={28} />
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={() => setReloadKey((current) => current + 1)}
                        style={buttonStyle}
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {!loading && !error && history.length === 0 && (
                <div
                    style={{
                        padding: '2rem',
                        textAlign: 'center',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        color: 'var(--color-lavender)',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)'
                    }}
                >
                    Ainda não há operações registradas no histórico.
                </div>
            )}

            {!loading && !error && history.length > 0 && (
                <section
                    aria-label="Eventos recentes da grade de aulas"
                    style={{ display: 'grid', gap: '1rem' }}
                >
                    {history.map((event) => {
                        const display = actionDisplay[event.action];

                        return (
                            <article
                                key={event.id}
                                style={{
                                    padding: '1.2rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(15, 23, 42, 0.85)'
                                }}
                            >
                                <header
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        flexWrap: 'wrap',
                                        marginBottom: '0.8rem'
                                    }}
                                >
                                    <span
                                        style={{
                                            padding: '0.35rem 0.65rem',
                                            borderRadius: '999px',
                                            color: display.color,
                                            backgroundColor: display.background,
                                            fontSize: '0.8rem',
                                            fontWeight: 700
                                        }}
                                    >
                                        {display.label}
                                    </span>

                                    <time
                                        dateTime={event.occurredAt}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            color: 'var(--color-lavender)',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        <Clock3 size={15} />
                                        {formatDate(event.occurredAt)}
                                    </time>
                                </header>

                                <h2
                                    style={{
                                        margin: '0 0 0.75rem',
                                        color: '#fff',
                                        fontSize: '1.15rem'
                                    }}
                                >
                                    {event.snapshot.subject}
                                </h2>

                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        flexWrap: 'wrap',
                                        color: 'var(--color-lavender)',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <span>
                                        <UserRound
                                            size={15}
                                            style={{ verticalAlign: 'middle', marginRight: '0.35rem' }}
                                        />
                                        {event.snapshot.professor}
                                    </span>

                                    <span>
                                        <MapPin
                                            size={15}
                                            style={{ verticalAlign: 'middle', marginRight: '0.35rem' }}
                                        />
                                        {event.snapshot.classroom}
                                    </span>

                                    <span>
                                        <CalendarDays
                                            size={15}
                                            style={{ verticalAlign: 'middle', marginRight: '0.35rem' }}
                                        />
                                        {event.snapshot.dayOfWeek}, {event.snapshot.time}
                                    </span>
                                </div>

                                <p
                                    style={{
                                        margin: '0.9rem 0 0',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    ID da aula: {event.scheduleId}
                                </p>
                            </article>
                        );
                    })}
                </section>
            )}
        </main>
    );
}