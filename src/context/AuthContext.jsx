import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in (from localStorage)
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Import API endpoint
            const { API_ENDPOINTS } = await import('@/config/api');
            
            const response = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const userData = {
                id: data.id,
                email: data.email,
                name: data.name,
                token: data.token
            };

            localStorage.setItem('admin_user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            
            // FOR DEVELOPMENT: Mock login (remove in production)
            if (email === 'admin@krakatau.com' && password === 'admin123') {
                const mockUser = {
                    id: 1,
                    email: 'admin@krakatau.com',
                    name: 'Admin',
                    token: 'mock-token-123'
                };
                localStorage.setItem('admin_user', JSON.stringify(mockUser));
                setUser(mockUser);
                return { success: true };
            }
            
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_user');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

