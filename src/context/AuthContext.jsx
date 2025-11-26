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

            const result = await response.json();
            
            // Backend returns: { success: true, data: { id, name, email, token } }
            if (!result.success || !result.data) {
                throw new Error(result.error || 'Invalid response format');
            }
            
            const userData = {
                id: result.data.id,
                email: result.data.email,
                name: result.data.name,
                token: result.data.token
            };

            localStorage.setItem('admin_user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            
            // Get error message from response if available
            let errorMessage = error.message || 'Login failed';
            try {
                // Try to get error from response
                const errorData = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                }).then(r => r.json()).catch(() => null);
                
                if (errorData && errorData.error) {
                    errorMessage = errorData.error;
                }
            } catch (e) {
                // Ignore
            }
            
            return { success: false, error: errorMessage };
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

