import React, { useEffect, useState } from "react";
import { slides } from "../helpers/constantsData";

const Carousel = ({ onGameChange }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Change game
    useEffect(() => {
        if (onGameChange) {
            onGameChange(slides[currentSlide].game);
        }
    }, [currentSlide]);

    // Handle slide change
    const handleSlideChange = (direction) => {
        setCurrentSlide((prev) =>
            direction === "next"
                ? (prev + 1) % slides.length
                : (prev - 1 + slides.length) % slides.length
        );
    };

    return (
        <div className="w-full overflow-hidden">
            <section className="relative w-full h-[200px]">
                {/* Current slide visible */}
                <div
                    className="w-full h-full flex items-center justify-center relative"
                    style={{
                        background: `var(--sec) url(${slides[currentSlide].banner}) no-repeat center / cover`,
                        backgroundBlendMode: "soft-light",
                    }}
                >
                    <h2 className="absolute text-white text-center text-5xl md:text-6xl [text-shadow:1px_1px_5px_var(--white)]">
                        {slides[currentSlide].title}
                    </h2>

                    {/* Visible navigation buttons */}
                    <div className="hidden md:flex absolute inset-0 justify-between items-center px-4 pointer-events-none">
                        <button
                            onClick={() => handleSlideChange("prev")}
                            className="pointer-events-auto text-white p-3 rounded-full hover:bg-white/10 transition-colors btn"
                        >
                            <i className="fa-solid fa-chevron-left text-xl" />
                        </button>
                        <button
                            onClick={() => handleSlideChange("next")}
                            className="pointer-events-auto text-white p-3 rounded-full hover:bg-white/10 transition-colors btn"
                        >
                            <i className="fa-solid fa-chevron-right text-xl" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Lower buttons logos */}
            <div className="flex justify-center items-center gap-12 py-2 md:-mt-16">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        onClick={() => setCurrentSlide(index)}
                        className="transition-transform scale-75 hover:scale-100"
                    >
                        <img
                            src={slide.logo}
                            alt={`${slide.title} logo`}
                            className={`h-12 object-contain cursor-pointer ${
                                index === currentSlide
                                    ? "opacity-100 img-user"
                                    : "opacity-60"
                            }`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
