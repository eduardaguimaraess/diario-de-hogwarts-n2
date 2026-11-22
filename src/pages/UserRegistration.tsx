import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle, Loader2, UserPlus } from 'lucide-react';
import {
  createAccountRequest,
  type CreateAccountInput,
  type UserRole
} from '../services/authApi';

const houses = ['Grifinória', 'Sonserina', 'Corvinal', 'Lufa-Lufa'] as const;

const emptyForm: CreateAccountInput = {
  name: '',
  email: '',
  role: 'student',
  house: '',
  password: ''
};

export function UserRegistration() {
  const [form, setForm] = useState<CreateAccountInput>(emptyForm);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function updateField<K extends keyof CreateAccountInput>(
    field: K,
    value: CreateAccountInput[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== passwordConfirmation) {
      setError('As senhas informadas não coincidem.');
      return;
    }

    setSubmitting(true);

    try {
      const createdUser = await createAccountRequest({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase()
      });

      setSuccess(
        `Conta de ${createdUser.role === 'teacher' ? 'professor(a)' : 'aluno(a)'} criada para ${createdUser.name}.`
      );
      setForm(emptyForm);
      setPasswordConfirmation('');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível cadastrar a conta.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 0.9rem',
    backgroundColor: 'var(--color-navy)',
    border: '1px solid var(--border-color)',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '0.9rem',
    boxSizing: 'border-box'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.4rem',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    fontWeight: 600
  };

  return (
    <main
      style={{
        maxWidth: '680px',
        margin: '2.5rem auto',
        padding: '2rem',
        backgroundColor: '#0b162c',
        border: '1px solid var(--border-color)',
        borderRadius: '16px'
      }}
    >
      <header style={{ marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--color-lavender)',
            marginBottom: '0.5rem'
          }}
        >
          <UserPlus size={24} />
          <h1 style={{ color: '#fff', fontSize: '1.6rem', margin: 0 }}>
            Cadastro de contas
          </h1>
        </div>
        <p style={{ color: 'var(--color-lavender)', margin: 0, fontSize: '0.9rem' }}>
          Cadastre alunos ou professores. A conta poderá acessar o portal após ser criada.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
      >
        <div style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="account-name" style={labelStyle}>
            Nome completo
          </label>
          <input
            id="account-name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="account-email" style={labelStyle}>
            E-mail
          </label>
          <input
            id="account-email"
            type="email"
            autoComplete="email"
            maxLength={190}
            required
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="account-role" style={labelStyle}>
            Perfil
          </label>
          <select
            id="account-role"
            required
            value={form.role}
            onChange={(event) =>
              updateField('role', event.target.value as UserRole)
            }
            style={inputStyle}
          >
            <option value="student">Aluno(a)</option>
            <option value="teacher">Professor(a)</option>
          </select>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="account-house" style={labelStyle}>
            Casa
          </label>
          <select
            id="account-house"
            required
            value={form.house}
            onChange={(event) => updateField('house', event.target.value)}
            style={inputStyle}
          >
            <option value="" disabled>
              Selecione uma casa
            </option>
            {houses.map((house) => (
              <option key={house} value={house}>
                {house}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="account-password" style={labelStyle}>
            Senha (mínimo de 8 caracteres)
          </label>
          <input
            id="account-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="account-password-confirmation" style={labelStyle}>
            Confirme a senha
          </label>
          <input
            id="account-password-confirmation"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            value={passwordConfirmation}
            onChange={(event) => {
              setPasswordConfirmation(event.target.value);
              setError(null);
              setSuccess(null);
            }}
            style={inputStyle}
          />
        </div>

        {(error || success) && (
          <p
            role={error ? 'alert' : 'status'}
            style={{
              gridColumn: '1 / -1',
              margin: 0,
              color: error ? '#ff8080' : '#5ee0a0',
              fontSize: '0.9rem'
            }}
          >
            {success && <CheckCircle size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />}
            {error ?? success}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            gridColumn: '1 / -1',
            backgroundColor: 'var(--color-blue)',
            color: '#fff',
            padding: '0.85rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            cursor: submitting ? 'wait' : 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem',
            opacity: submitting ? 0.7 : 1
          }}
        >
          {submitting ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
          {submitting ? 'Cadastrando...' : 'Criar conta'}
        </button>
      </form>
    </main>
  );
}
