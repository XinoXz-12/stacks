import { useContext, useState, useEffect, createContext } from "react";
import {
    login as loginService,
    register as registerService,
    logout as logoutService,
    checkAuth,
} from "../services/stacks";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth se debe usar dentro de un AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth
    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            try {
                if (window.location.pathname !== "/login") {
                    const response = await checkAuth();

                    if (response.success) {
                        setUser(response.user);
                    } else {
                        setUser(null);
                    }
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Register user
    const register = async ({ username, email, password, age, gender }) => {
        try {
            setLoading(true);
            const response = await registerService({
                username,
                email,
                password,
                age,
                gender,
            });

            if (!response.success) {
                return { success: false, message: response.message };
            }

            setUser(response.user);

            return { success: true, message: "¡Bienvenido!" };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (formData) => {
        try {
            setLoading(true);

            const response = await loginService(formData);

            if (!response.success) {
                throw new Error("Respuesta inválida del servidor");
            }

            setUser(response.user);

            return { success: true, message: response.message };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Logout user
    const logout = async () => {
        const response = await logoutService();
        if (response.success) {
            setUser(null);
        }
    };

    // Auth context value
    const value = {
        user,
        error,
        setError,
        loading,
        register,
        login,
        logout,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
