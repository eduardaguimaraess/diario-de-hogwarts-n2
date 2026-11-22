import type { PropsWithChildren } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Favorites } from './pages/Favorites';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Potions } from './pages/Potions';
import { Schedule } from './pages/Schedule';
import { ScheduleHistory } from './pages/ScheduleHistory';
import { SchedulePaginated } from './pages/SchedulePaginated';
import { ScheduleStudent } from './pages/ScheduleStudent';
import { SpellDetail } from './pages/SpellDetail';
import { Spells } from './pages/Spells';
import { UserRegistration } from './pages/UserRegistration';

function RequireAuthentication({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        role="status"
        style={{
          padding: '4rem',
          textAlign: 'center',
          color: 'var(--color-lavender)'
        }}
      >
        Verificando sua sessão...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RequireTeacher({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        role="status"
        style={{
          padding: '4rem',
          textAlign: 'center',
          color: 'var(--color-lavender)'
        }}
      >
        Verificando suas permissões...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== 'teacher') {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function ScheduleByRole() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return user.role === 'teacher' ? <Schedule /> : <ScheduleStudent />;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/home"
            element={
              <RequireAuthentication>
                <Home />
              </RequireAuthentication>
            }
          />
          <Route
            path="/spells"
            element={
              <RequireAuthentication>
                <Spells />
              </RequireAuthentication>
            }
          />
          <Route
            path="/spells/:id"
            element={
              <RequireAuthentication>
                <SpellDetail />
              </RequireAuthentication>
            }
          />
          <Route
            path="/favorites"
            element={
              <RequireAuthentication>
                <Favorites />
              </RequireAuthentication>
            }
          />
          <Route
            path="/schedule"
            element={
              <RequireAuthentication>
                <ScheduleByRole />
              </RequireAuthentication>
            }
          />
          <Route
            path="/schedule/search"
            element={
              <RequireAuthentication>
                <SchedulePaginated />
              </RequireAuthentication>
            }
          />
          <Route
            path="/schedule/history"
            element={
              <RequireTeacher>
                <ScheduleHistory />
              </RequireTeacher>
            }
          />
          <Route
            path="/users/new"
            element={
              <RequireTeacher>
                <UserRegistration />
              </RequireTeacher>
            }
          />
          <Route
            path="/potions"
            element={
              <RequireAuthentication>
                <Potions />
              </RequireAuthentication>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
