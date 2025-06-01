import React from "react";
import { features } from "../helpers/constantsData";

const Home = () => {
    return (
        <main>
            <section className="container mx-auto flex flex-col md:flex-row gap-10 items-center py-20 px-4">
                <div className="md:w-1/2 animate-fade-in">
                    {/* Title */}
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r pb-6 from-[var(--prim)] to-purple-600 bg-clip-text text-transparent text-center md:text-left">
                        Construye tu equipo ganador
                    </h1>
                    {/* Description */}
                    <p className="text-xl mb-10 text-gray-600 dark:text-gray-300 text-center md:text-left">
                        Stacks te ayuda a encontrar compañeros de equipo,
                        programar partidas y competir en un ambiente positivo y
                        libre de toxicidad.
                    </p>
                    {/* Buttons */}
                    <div className="flex gap-4">
                        <a
                            id="get-started"
                            href="/register"
                            className="btn btn-action bg-[var(--prim)] text-white px-8 py-4 rounded-lg hover:bg-[var(--prim-hover)] transition-all transform hover:scale-105 hover:shadow-lg text-center"
                        >
                            Comenzar ahora
                        </a>
                        <a
                            href="#features"
                            className="btn px-8 py-4 border-2 border-[var(--prim)] text-[var(--prim)] rounded-lg hover:bg-[var(--prim)] hover:text-white transition-all text-center
                            scroll-smooth"
                        >
                            Conoce más
                        </a>
                    </div>
                </div>
                <div className="md:w-1/2 mt-10 md:mt-0 animate-float">
                    {/* Image */}
                    <img
                        src="https://images.pexels.com/photos/7848992/pexels-photo-7848992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Ilustración de Stacks"
                        className="w-full rounded-2xl shadow-2xl transform hover:scale-102 transition-all duration-300"
                        style={{
                            boxShadow:
                                "0 0 2px var(--prim), 0 0 15px var(--prim), 0 0 20px var(--prim)",
                        }}
                    />
                </div>
            </section>

            <section id="features" className="bg-[var(--sec)] rounded-lg py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[var(--prim)] to-purple-600 bg-clip-text text-transparent">
                        Características principales
                    </h2>
                    {/* Features cards from object features in helpers/constantsData.js */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-8 bg-[var(--prim)] rounded-xl shadow-black shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                            >
                                <div className="text-4xl mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact section */}
            <section className="container mx-auto py-20 px-4 text-center">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[var(--prim)] to-purple-600 bg-clip-text text-transparent">
                    ¿Listo para unirte?
                </h2>
                <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
                    Únete a nuestra comunidad y comienza a construir tu equipo
                    ideal
                </p>
                <div className="flex flex-col items-center gap-4">
                    <a
                        href="mailto:contact@stacks.gg"
                        className="text-[var(--prim)] text-lg hover:underline flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>contact@stacks.gg</span>
                    </a>
                </div>
            </section>
        </main>
    );
};

export default Home;
