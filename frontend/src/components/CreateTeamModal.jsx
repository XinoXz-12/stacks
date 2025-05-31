import React, { useEffect, useRef, useState } from "react";
import { createTeam } from "../services/stacks";
import { useToast } from "../context/ToastContext";
import { cleanBackendMessage } from "../helpers/normalizeFuctions";

const CreateTeamModal = ({ user, setShowModal, onCreated }) => {
    const { addToast } = useToast();
    const [form, setForm] = useState({
        name: "",
        game: "Valorant",
        creatorUserId: user.id,
    });
    const [closing, setClosing] = useState(false);
    const modalRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTeam(form);
            addToast("Stack creada", "success");
            onCreated();
            closeWithAnimation();
        } catch (error) {
            console.error(error);
            addToast(cleanBackendMessage(error.message), "error");
        }
    };

    const closeWithAnimation = () => {
        setClosing(true);
        setTimeout(() => setShowModal(false), 200);
    };

    // Cierre con Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") closeWithAnimation();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Cierre al hacer clic fuera del modal
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                closeWithAnimation();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
                closing ? "opacity-0" : "opacity-100"
            }`}
        >
            <div
                ref={modalRef}
                className={`bg-[var(--sec)] p-6 rounded-lg max-w-md w-4/5 md:w-full text-white shadow-lg relative border-t-2 border-[var(--prim)] transform transition-all duration-200 ${
                    closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
                }`}
            >
                <button
                    onClick={closeWithAnimation}
                    className="absolute top-4 right-4 text-xl font-bold text-white hover:text-red-500"
                    aria-label="Cerrar modal"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <h2 className="text-2xl font-semibold mb-4">
                    Crear nuevo Stack
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block mb-1">
                            Nombre del Stack
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md bg-[var(--sec)] text-white border border-white focus:bg-[var(--bg)]"
                        />
                    </div>

                    <div>
                        <label htmlFor="game" className="block mb-1">
                            Juego
                        </label>
                        <select
                            id="game"
                            name="game"
                            value={form.game}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md bg-[var(--sec)] text-white border border-white focus:bg-[var(--bg)]"
                        >
                            <option value="Valorant">Valorant</option>
                            <option value="LoL">LoL</option>
                            <option value="Fortnite">Fortnite</option>
                            <option value="Overwatch">Overwatch 2</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full btn bg-[var(--prim)] hover:bg-[var(--prim-hover)] transition-colors py-2 rounded text-lg font-medium"
                    >
                        Crear
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTeamModal;
