import React, { createContext, useState, useContext } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const typeStyles = {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-[var(--prim)]",
    };

    const icons = {
        success: "fa-solid fa-check-circle",
        error: "fa-solid fa-xmark-circle",
        info: "fa-solid fa-circle-info",
    };

    const addToast = (message, type = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 2000);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {toasts.length > 0 && (
                <div className="fixed bottom-4 right-4 z-1000 space-y-2">
                    {toasts.map(({ id, message, type }) => {
                        return (
                            <div
                                key={id}
                                className={`relative overflow-hidden rounded px-4 py-2 text-white shadow-lg flex items-center gap-2 ${
                                    typeStyles[type] || typeStyles.info
                                }`}
                            >
                                <i className={icons[type] || icons.info} />
                                <span>{message}</span>
                                <div className="absolute bottom-0 left-0 h-0.5 bg-white toast-bar" />
                            </div>
                        );
                    })}
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast debe usarse dentro de un ToastProvider");
    }
    return context;
};

export default ToastContext;
