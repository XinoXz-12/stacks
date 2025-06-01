import React, { useState } from "react";
import { faqs } from "../helpers/constantsData";

const Faq = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    // Toggle FAQ
    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="w-full max-w-3xl mx-auto my-8 p-6 bg-[var(--bg)] text-white rounded-xl">
            <h1 className="text-3xl font-bold text-center mb-8">
                Preguntas Frecuentes
            </h1>
            <div className="flex flex-col gap-4">
                {/* FAQ's cards from object faqs in helpers/constantsData.js */}
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        onClick={() => toggleFaq(index)}
                        className={`rounded-lg p-4 bg-[var(--sec)] cursor-pointer transition-all duration-300 ${
                            activeIndex === index
                                ? "border border-[var(--prim)]"
                                : ""
                        } hover:translate-x-1`}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                                {faq.question}
                            </h3>
                            <span className="text-[var(--prim)] text-xl font-bold">
                                {activeIndex === index ? "-" : "+"}
                            </span>
                        </div>
                        <div
                            className={`transition-all duration-600 overflow-hidden ${
                                activeIndex === index ? "mt-4" : "h-0"
                            }`}
                        >
                            {activeIndex === index && (
                                <p className="text-white leading-relaxed">
                                    {faq.answer}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Faq;
