import { useContext, useState, useEffect, createContext } from "react";
import { login as loginService } from "../services/stacks";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth se debe usar dentro de un AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const userLoggin = localStorage.getItem("user");
        return userLoggin ? JSON.parse(userLoggin) : null;
    });
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);

            const lsToken = localStorage.getItem("token");
            const lsUser = JSON.parse(localStorage.getItem("user"));

            if (lsToken && lsUser) {
                setToken(lsToken);
                setUser(lsUser);
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    const register = async ({ username, email, password, age, gender }) => {
        try {
            setLoading(true);
            const response = await fetch(`${VITE_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    age,
                    gender,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, message: data.message };
            }

            setToken(data.token);
            setUser(data.user);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            return { success: true, message: "¡Bienvenido!" };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    const login = async (formData) => {
        try {
            setLoading(true);

            const data = await loginService(formData);

            if (!data.token || !data.user) {
                throw new Error("Respuesta inválida del servidor");
            }

            setToken(data.token);
            setUser(data.user);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            return { success: true, message: data.message };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const value = {
        user,
        token,
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
