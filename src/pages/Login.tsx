import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { user, loading: checkingSession, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login({ email: email.trim(), password });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'Não foi possível realizar o login.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingSession) {
    return (
      <div
        role="status"
        style={{
          padding: '5rem',
          textAlign: 'center',
          color: 'var(--color-lavender)'
        }}
      >
        <Loader2 className="animate-spin" size={32} />
        <p>Verificando sua sessão...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <main
      style={{
        maxWidth: '420px',
        margin: '4rem auto',
        padding: '2.5rem',
        backgroundColor: '#0b162c',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'var(--color-purple-dark)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            border: '1px solid var(--color-lavender)'
          }}
        >
          <Sparkles color="var(--color-lavender)" size={28} />
        </div>

        <h1
          style={{
            color: '#fff',
            fontSize: '1.6rem',
            marginBottom: '0.4rem'
          }}
        >
          Acesso ao Sistema
        </h1>

        <p style={{ color: 'var(--color-lavender)', fontSize: '0.85rem' }}>
          Alunos e professores entram com e-mail e senha. O sistema identifica seu perfil automaticamente. Para criar uma conta, procure um professor.
        </p>
      </header>

      <form
        onSubmit={handleLogin}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
      >
        <div>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: '0.4rem',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            E-mail
          </label>

          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            maxLength={190}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-navy)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '0.9rem',
              boxSizing: 'border-box'
            }}
            placeholder="seu.email@exemplo.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: '0.4rem',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            Senha
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-navy)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '0.9rem',
              boxSizing: 'border-box'
            }}
            placeholder="Digite sua senha"
          />
        </div>

        {error && (
          <p
            role="alert"
            style={{
              margin: 0,
              color: '#ff8080',
              fontSize: '0.9rem'
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            backgroundColor: 'var(--color-blue)',
            color: '#fff',
            padding: '0.85rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            cursor: submitting ? 'wait' : 'pointer',
            marginTop: '0.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem',
            opacity: submitting ? 0.7 : 1
          }}
        >
          {submitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <ShieldCheck size={18} />
          )}
          {submitting ? 'Entrando...' : 'Acessar Sistema'}
        </button>
      </form>
    </main>
  );
}
