import React, { useState, useCallback } from "react";
import Badges from "./Badges";
import ConfirmModal from "./ConfirmModal";

const NewsCard = ({ news }) => {
    const [showModal, setShowModal] = useState(false);
    const [pendingLink, setPendingLink] = useState(null);

    const handleCardClick = () => {
        if (!news.link) return;
        setPendingLink(news.link);
        setShowModal(true);
    };

    const handleConfirmNavigation = useCallback(() => {
        if (pendingLink) {
            window.open(pendingLink, "_blank", "noopener,noreferrer");
            setShowModal(false);
            setPendingLink(null);
        }
    }, [pendingLink]);

    return (
        <>
            <div
                onClick={handleCardClick}
                className="cursor-pointer flex flex-col sm:flex-row overflow-hidden border-2 border-[var(--prim)] rounded-lg bg-[var(--sec)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_var(--prim),0_0_30px_var(--prim)] relative"
            >
                <img
                    src={news.image}
                    alt={news.title}
                    className="w-[320px] h-[180px] object-cover"
                />
                <div className="p-4 flex flex-col justify-between">
                    <div>
                        <h2 className="text-white text-lg font-semibold mb-2">
                            {news.title}
                        </h2>
                        <p className="text-sm text-white mb-4">
                            {news.summary}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Badges game={news.game} />
                    </div>
                </div>
                <div className="absolute bottom-0 right-4 lg:top-4 italic">
                    <p className="text-sm text-gray-300 mb-4">{news.date}</p>
                </div>
            </div>

            <ConfirmModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmNavigation}
                title="¿Quieres salir del sitio?"
                description="Estás a punto de ser redirigido a una página externa. ¿Deseas continuar?"
                confirmText="Ir al sitio"
                cancelText="Cancelar"
                type="info"
            />
        </>
    );
};

export default NewsCard;
