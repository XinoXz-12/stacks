import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const validateForm = ({
    username,
    email,
    password,
    repassword,
    age,
    gender,
}) => {
    if (username.length < 3)
        return "El usuario debe tener al menos 3 caracteres";
    if (!email.includes("@") || !email.includes("."))
        return "Por favor, introduce un email válido";
    if (password.length < 4)
        return "La contraseña debe tener al menos 4 caracteres";
    if (password !== repassword) return "Las contraseñas no coinciden";
    if (!age || age < 14) return "Debes ser mayor de 14 años";
    if (!gender) return "Por favor, selecciona un género";
    return null;
};

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        repassword: "",
        age: "",
        gender: "",
    });

    const [error, setError] = useState("");

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setError("");

            const validationMessage = validateForm(formData);
            if (validationMessage) {
                setError(validationMessage);
                return;
            }

            try {
                const response = await register(formData);
                if (!response?.success) {
                    addToast(
                        response.message || "Error en el registro",
                        "error"
                    );
                    return;
                }

                addToast("¡Bienvenido!", "success");
                navigate("/login");
            } catch (err) {
                addToast(err.message || "Error en el registro", "error");
            }
        },
        [formData, register, navigate, addToast]
    );

    return (
        <div className="w-full max-w-4xl bg-[var(--sec)] rounded-lg p-8 shadow-md my-4 lg:my-0">
            <h1 className="mb-8 text-3xl font-bold text-[var(--white)] text-center">
                Registrarse
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
                    {[
                        { label: "Usuario", name: "username", type: "text" },
                        { label: "Email", name: "email", type: "email" },
                        {
                            label: "Contraseña",
                            name: "password",
                            type: "password",
                        },
                        {
                            label: "Repetir Contraseña",
                            name: "repassword",
                            type: "password",
                        },
                        { label: "Edad", name: "age", type: "number" },
                    ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-[var(--white)]">
                                {label}
                            </label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border p-2 focus:bg-[var(--bg)]"
                                required
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-[var(--white)]">
                            Género
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="mt-1 w-full rounded border p-2 focus:bg-[var(--bg)]"
                            required
                        >
                            <option value="">Selecciona un género</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="Other">Otro</option>
                        </select>
                    </div>
                </div>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <div className="flex flex-col items-center gap-4">
                    <button
                        type="submit"
                        className="btn w-1/2 rounded bg-[var(--prim)] px-4 py-2 text-[var(--white)] hover:bg-[var(--prim-hover)] active:bg-[var(--bg)] active:border-[var(--prim)] active:border-1"
                    >
                        Registrarse
                    </button>
                    <p className="text-center text-sm text-[var(--white)]">
                        ¿Ya tienes cuenta?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-sky-600 hover:underline"
                        >
                            Inicia sesión
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Register;
