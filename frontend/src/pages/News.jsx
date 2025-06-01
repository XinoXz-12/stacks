import React, { useEffect, useMemo, useState } from "react";
import banner_news from "../assets/images/banner_news.png";
import NewsCard from "../components/NewsCards";
import LoadingSpinner from "../components/LoadingSpinner";
import { getAllNews } from "../services/stacks";
import { useToast } from "../context/ToastContext";
import { cleanBackendMessage } from "../helpers/normalizeFuctions";
import useFetch from "../hooks/useFetch";

const NewsPage = () => {
    const { addToast } = useToast();
    const [game, setGame] = useState("");

    const { data: response, loading, error } = useFetch(() => getAllNews(), []);

    const news = response?.data || [];

    // Handle error
    useEffect(() => {
        if (error) {
            const msg = cleanBackendMessage(error);
            if (typeof msg === "string") {
                addToast(msg, "error");
            }
        }
    }, [error]);  

    // Filter local with useMemo
    const filteredNews = useMemo(() => {
        if (!game) return news;
        return news.filter((item) => item.game === game);
    }, [game, news]);

    return (
        <main className="container mx-auto px-4 pb-6">
            {/* Banner */}
            <div className="relative w-screen max-w-none left-1/2 transform -translate-x-1/2 overflow-hidden">
                <div
                    className="flex items-center justify-center h-[200px]"
                    style={{
                        background: `var(--sec) url(${banner_news}) no-repeat center / cover`,
                        backgroundBlendMode: "soft-light",
                    }}
                >
                    <h2 className="absolute text-white text-6xl [text-shadow:1px_1px_5px_var(--white)]">
                        Noticias
                    </h2>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white mt-6 mb-4 capitalize">
                    Últimas noticias
                </h1>

                {/* Select for filter news by game */}
                <select
                    name="game"
                    className="bg-[var(--bg)] text-white border-2 border-white rounded-md p-2"
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                >
                    <option value="">Todas</option>
                    <option value="Valorant">Valorant</option>
                    <option value="LoL">League of Legends</option>
                    <option value="Overwatch">Overwatch</option>
                    <option value="Fortnite">Fortnite</option>
                </select>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <LoadingSpinner />
                </div>
            ) : filteredNews.length === 0 ? (
                <p className="text-white/70 italic">
                    No hay noticias para este juego.
                </p>
            ) : (
                <section className="flex flex-col gap-5">
                    {/* News cards */}
                    {filteredNews.map((newsItem, index) => (
                        <NewsCard key={index} news={newsItem} />
                    ))}
                </section>
            )}
        </main>
    );
};

export default NewsPage;
