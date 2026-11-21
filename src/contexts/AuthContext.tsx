import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import type { PropsWithChildren } from 'react';
import {
    getCurrentUser,
    loginRequest,
    logoutRequest
} from '../services/authApi';
import type {
    AuthenticatedUser,
    LoginCredentials
} from '../services/authApi';

interface AuthContextValue {
    user: AuthenticatedUser | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function restoreSession() {
            try {
                const currentUser = await getCurrentUser();

                if (!cancelled) {
                    setUser(currentUser);
                }
            } catch {
                if (!cancelled) {
                    setUser(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        restoreSession();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const authenticatedUser = await loginRequest(credentials);
        setUser(authenticatedUser);
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutRequest();
        } finally {
            setUser(null);
        }
    }, []);

    const value = useMemo(
        () => ({ user, loading, login, logout }),
        [user, loading, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth precisa ser usado dentro de AuthProvider.');
    }

    return context;
}