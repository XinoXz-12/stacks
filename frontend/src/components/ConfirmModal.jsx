import React, { useEffect, useRef, useState } from "react";
import { typeStyles } from "../helpers/constantsData";

const ConfirmModal = ({
    show,
    onClose,
    onConfirm,
    title = "¿Estás seguro?",
    description = "Esta acción no se puede deshacer.",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = "danger",
}) => {
    const [closing, setClosing] = useState(false);
    const modalRef = useRef(null);

    const { color, icon } = typeStyles[type] || typeStyles.info;

    // Close with animation
    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            setClosing(false);
            onClose();
        }, 200);
    };

    // Escape to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") handleClose();
        };
        if (show) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [show]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                handleClose();
            }
        };
        if (show) document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [show]);

    if (!show && !closing) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
                closing ? "opacity-0" : "opacity-100"
            }`}
        >
            {/* Modal */}
            <div
                ref={modalRef}
                className={`bg-[var(--sec)] text-white rounded-lg p-6 w-full max-w-xs md:max-w-sm shadow-xl border-t-2 border-[var(--prim)] transform transition-all duration-200 ${
                    closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
                }`}
            >
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="mb-6 text-sm text-white/80">{description}</p>
                <div className="flex flex-col md:flex-row md:justify-end gap-2">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded flex items-center justify-center gap-2 ${color}`}
                    >
                        <i className={icon} />
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
