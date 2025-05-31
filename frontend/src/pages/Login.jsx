import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { cleanBackendMessage } from "../helpers/normalizeFuctions";

const validateLogin = (email, password) => {
    if (email.length < 5) return "El email debe tener al menos 5 caracteres";
    if (password.length < 4)
        return "La contraseña debe tener al menos 4 caracteres";
    return null;
};

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addToast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setError("");

            const validationError = validateLogin(email, password);
            if (validationError) {
                setError(validationError);
                return;
            }

            try {
                const response = await login({ email, password });

                if (response?.success) {
                    addToast(response.message, "success");
                    navigate("/teams");
                } else {
                    addToast(cleanBackendMessage(response.message), "error");
                }
            } catch (err) {
                console.error(err);
                addToast(cleanBackendMessage(err.message), "error");
            }
        },
        [email, password, login, navigate, addToast]
    );

    return (
        <div className="w-full max-w-md bg-[var(--sec)] rounded-lg p-8 shadow-md md:my-4">
            <h1 className="mb-8 text-3xl font-bold text-[var(--white)]">
                Iniciar Sesión
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--white)]">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded border p-2 focus:bg-[var(--bg)]"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--white)]">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full rounded border p-2 focus:bg-[var(--bg)]"
                        required
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <button
                    type="submit"
                    className="btn w-full rounded bg-[var(--prim)] px-4 py-2 text-[var(--white)] hover:bg-[var(--prim-hover)] active:bg-[var(--bg)] active:border-[var(--prim)] active:border-1"
                >
                    Iniciar Sesión
                </button>

                <p className="text-center text-sm text-[var(--white)]">
                    ¿No tienes cuenta?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="text-sky-600 hover:underline"
                    >
                        Regístrate
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;
