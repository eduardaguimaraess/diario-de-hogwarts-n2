import { useEffect, useState } from 'react';
import {
    AlertTriangle,
    BookmarkPlus,
    Calendar,
    CheckCircle,
    Clock,
    Loader2,
    MapPin,
    Plus,
    Trash2,
    User
} from 'lucide-react';
import { getSchedule } from '../services/api';
import type { ScheduleClass } from '../types/hogwarts';

type ScheduleTab = 'general' | 'my-plan';

const daysOfWeek = [
    'Todos',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira'
];

function readSavedPlan(): ScheduleClass[] {
    try {
        const savedPlan = localStorage.getItem('hogwarts_my_schedule_plan');
        return savedPlan ? (JSON.parse(savedPlan) as ScheduleClass[]) : [];
    } catch {
        return [];
    }
}

export function ScheduleStudent() {
    const [schedule, setSchedule] = useState<ScheduleClass[]>([]);
    const [myPlan, setMyPlan] = useState<ScheduleClass[]>(readSavedPlan);
    const [selectedDay, setSelectedDay] = useState('Todos');
    const [activeTab, setActiveTab] = useState<ScheduleTab>('general');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function loadSchedule() {
            try {
                setLoading(true);
                setError(null);

                const result = await getSchedule();

                if (!cancelled) {
                    setSchedule(result);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'Não foi possível carregar os horários.'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadSchedule();

        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    useEffect(() => {
        localStorage.setItem('hogwarts_my_schedule_plan', JSON.stringify(myPlan));
    }, [myPlan]);

    const displayedSchedule =
        activeTab === 'general' ? schedule : myPlan;

    const filteredSchedule =
        selectedDay === 'Todos'
            ? displayedSchedule
            : displayedSchedule.filter((item) => item.dayOfWeek === selectedDay);

    function addToPlan(item: ScheduleClass) {
        if (myPlan.some((planItem) => planItem.id === item.id)) {
            return;
        }

        setMyPlan((currentPlan) => [...currentPlan, item]);
    }

    function removeFromPlan(id: string) {
        setMyPlan((currentPlan) =>
            currentPlan.filter((item) => item.id !== id)
        );
    }

    if (loading) {
        return (
            <div
                role="status"
                style={{
                    padding: '5rem',
                    textAlign: 'center',
                    color: 'var(--color-lavender)'
                }}
            >
                <Loader2
                    className="animate-spin"
                    size={36}
                    style={{ marginBottom: '1rem' }}
                />
                <p>Carregando a grade de Hogwarts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                role="alert"
                style={{
                    padding: '5rem',
                    textAlign: 'center',
                    color: '#ff6b6b'
                }}
            >
                <AlertTriangle size={36} style={{ marginBottom: '1rem' }} />
                <p>{error}</p>
                <button
                    type="button"
                    onClick={() => setReloadKey((current) => current + 1)}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--color-navy)',
                        color: '#fff',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <main
            style={{
                padding: '2rem',
                maxWidth: '1100px',
                margin: '0 auto'
            }}
        >
            <header style={{ marginBottom: '1.5rem' }}>
                <h1
                    style={{
                        color: '#fff',
                        fontSize: '1.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        margin: 0
                    }}
                >
                    <Calendar color="var(--color-lavender)" size={24} />
                    Grade Curricular & Horários
                </h1>
                <p style={{ color: 'var(--color-lavender)', fontSize: '0.9rem' }}>
                    Consulta de aulas e organização do seu plano de estudos.
                </p>
            </header>

            <div
                style={{
                    display: 'flex',
                    gap: '1rem',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '1.5rem'
                }}
            >
                <button
                    type="button"
                    onClick={() => setActiveTab('general')}
                    style={{
                        padding: '0.75rem 1.25rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom:
                            activeTab === 'general'
                                ? '3px solid var(--color-lavender)'
                                : '3px solid transparent',
                        color: activeTab === 'general' ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Calendar size={17} />
                    Grade Geral
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('my-plan')}
                    style={{
                        padding: '0.75rem 1.25rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom:
                            activeTab === 'my-plan'
                                ? '3px solid var(--color-lavender)'
                                : '3px solid transparent',
                        color: activeTab === 'my-plan' ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <BookmarkPlus size={17} />
                    Meu Plano ({myPlan.length})
                </button>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap'
                }}
            >
                {daysOfWeek.map((day) => (
                    <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: '1px solid var(--border-color)',
                            backgroundColor:
                                selectedDay === day ? 'var(--color-purple-dark)' : '#0b162c',
                            color: selectedDay === day ? '#fff' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {filteredSchedule.length === 0 ? (
                <div
                    style={{
                        backgroundColor: '#0b162c',
                        padding: '3rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '1px solid var(--border-color)',
                        color: 'var(--color-lavender)'
                    }}
                >
                    {activeTab === 'my-plan'
                        ? 'Seu plano ainda não tem aulas para este dia.'
                        : `Nenhuma aula agendada para ${selectedDay}.`}
                </div>
            ) : (
                <section
                    aria-label="Aulas"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1rem'
                    }}
                >
                    {filteredSchedule.map((item) => {
                        const isInPlan = myPlan.some(
                            (planItem) => planItem.id === item.id
                        );

                        return (
                            <article
                                key={item.id}
                                style={{
                                    backgroundColor: '#0b162c',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '1.25rem'
                                }}
                            >
                                <span
                                    style={{
                                        backgroundColor: 'rgba(150, 129, 217, 0.15)',
                                        color: 'var(--color-lavender)',
                                        border: '1px solid var(--border-color)',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {item.dayOfWeek}
                                </span>

                                <h2
                                    style={{
                                        color: '#fff',
                                        fontSize: '1.1rem',
                                        margin: '0.9rem 0'
                                    }}
                                >
                                    {item.subject}
                                </h2>

                                <div
                                    style={{
                                        display: 'grid',
                                        gap: '0.55rem',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.88rem',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    <span>
                                        <User size={15} /> Docente: {item.professor}
                                    </span>
                                    <span>
                                        <MapPin size={15} /> Local: {item.classroom}
                                    </span>
                                    <span>
                                        <Clock size={15} /> Horário: {item.time}
                                    </span>
                                </div>

                                {activeTab === 'general' ? (
                                    <button
                                        type="button"
                                        onClick={() => addToPlan(item)}
                                        disabled={isInPlan}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            borderRadius: '6px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: isInPlan
                                                ? 'rgba(44, 123, 145, 0.2)'
                                                : 'var(--color-navy)',
                                            color: isInPlan ? 'var(--color-teal-light)' : '#fff',
                                            cursor: isInPlan ? 'default' : 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}
                                    >
                                        {isInPlan ? (
                                            <>
                                                <CheckCircle size={15} />
                                                Adicionada ao plano
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={15} />
                                                Adicionar ao meu plano
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => removeFromPlan(item.id)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem',
                                            borderRadius: '6px',
                                            border: '1px solid rgba(239, 68, 68, 0.4)',
                                            backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                            color: '#fca5a5',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}
                                    >
                                        <Trash2 size={15} />
                                        Remover do meu plano
                                    </button>
                                )}
                            </article>
                        );
                    })}
                </section>
            )}
        </main>
    );
}