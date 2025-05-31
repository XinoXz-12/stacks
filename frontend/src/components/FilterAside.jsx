import React, { useState, useEffect } from "react";
import CreateTeamModal from "./CreateTeamModal";
import { getRanksData } from "../services/stacks";
import {
    normalizeGenderTeam,
    normalizeStyle,
    normalizeServer,
    cleanBackendMessage,
} from "../helpers/normalizeFuctions";
import { gendersTeam } from "../helpers/constantsData";
import { useToast } from "../context/ToastContext";
import useFetch from "../hooks/useFetch";

const FilterAside = ({ filters, setFilters, user, onCreated }) => {
    const { addToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const { data: ranksData, error: ranksError } = useFetch(getRanksData, []);

    const ranksByGame = ranksData || {};

    useEffect(() => {
        if (ranksError) {
            addToast(cleanBackendMessage(ranksError), "error");
        }
    }, [ranksError, addToast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            {/* Mobile header */}
            <div className="flex lg:hidden justify-between items-center gap-4">
                {user && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn bg-[var(--prim)] hover:bg-[var(--prim-hover)] transition-colors py-2 px-4 rounded text-sm font-medium w-full"
                    >
                        Crear Stack
                    </button>
                )}
                <button
                    onClick={() => setShowFilters((prev) => !prev)}
                    className={`text-white text-xl ${
                        !user ? "mx-auto lg:mx-0" : ""
                    }`}
                >
                    <i
                        className={`fas ${
                            showFilters ? "fa-xmark" : "fa-sliders"
                        }`}
                    />
                </button>
            </div>

            <aside
                className={`${
                    showFilters ? "block" : "hidden"
                } lg:block w-full lg:w-1/5 bg-[var(--sec)] text-white p-6 space-y-6 rounded-lg mb-8`}
            >
                {user && (
                    <div className="create-team hidden lg:block">
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full btn bg-[var(--prim)] hover:bg-[var(--prim-hover)] transition-colors py-2 rounded text-lg font-medium"
                        >
                            Crear Stack
                        </button>
                    </div>
                )}

                <div className="div-form space-y-4">
                    <h4 className="text-xl font-semibold">Búsqueda</h4>
                    <form className="space-y-4 text-sm">
                        {/* Región */}
                        <div className="flex flex-col">
                            <label htmlFor="region" className="mb-1">
                                Región
                            </label>
                            <select
                                id="region"
                                name="region"
                                value={filters.region}
                                onChange={handleChange}
                                className="border border-white rounded px-3 py-2 w-full bg-[var(--sec)] text-white focus:bg-[var(--bg)]"
                            >
                                <option value="">Todas</option>
                                {["NA", "EU", "LATAM", "BR", "AP", "KR"].map(
                                    (region) => (
                                        <option key={region} value={region}>
                                            {normalizeServer(region)}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* Edad */}
                        <div className="grid grid-cols-2 gap-4">
                            {["minAge", "maxAge"].map((field) => (
                                <div key={field} className="flex flex-col">
                                    <label htmlFor={field} className="mb-1">
                                        {field === "minAge"
                                            ? "Edad mínima"
                                            : "Edad máxima"}
                                    </label>
                                    <input
                                        type="number"
                                        id={field}
                                        name={field}
                                        value={filters[field]}
                                        onChange={handleChange}
                                        min={0}
                                        max={100}
                                        className="border border-white rounded px-3 py-2 w-full bg-[var(--sec)] text-white focus:bg-[var(--bg)]"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Rango */}
                        <div className="grid grid-cols-2 gap-4">
                            {["minRank", "maxRank"].map((field) => (
                                <div key={field} className="flex flex-col">
                                    <label htmlFor={field} className="mb-1">
                                        {field === "minRank"
                                            ? "Rango mínimo"
                                            : "Rango máximo"}
                                    </label>
                                    <select
                                        id={field}
                                        name={field}
                                        value={filters[field]}
                                        onChange={handleChange}
                                        className="border border-white rounded px-3 py-2 w-full bg-[var(--sec)] text-white focus:bg-[var(--bg)]"
                                    >
                                        <option value="">Todos</option>
                                        {(
                                            ranksByGame[filters.game]?.ranks ||
                                            []
                                        ).map((rank) => (
                                            <option key={rank} value={rank}>
                                                {rank}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        {/* Jugadores */}
                        <div className="grid grid-cols-2 gap-4">
                            {["minPlayers", "maxPlayers"].map((field) => (
                                <div key={field} className="flex flex-col">
                                    <label htmlFor={field} className="mb-1">
                                        {field === "minPlayers"
                                            ? "Jugadores mínimos"
                                            : "Jugadores máximos"}
                                    </label>
                                    <input
                                        type="number"
                                        id={field}
                                        name={field}
                                        value={filters[field]}
                                        onChange={handleChange}
                                        min={0}
                                        max={5}
                                        className="border border-white rounded px-3 py-2 w-full bg-[var(--sec)] text-white focus:bg-[var(--bg)]"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Estilo */}
                        <fieldset className="space-y-2">
                            <legend className="font-medium">
                                Estilo de juego
                            </legend>
                            <div className="flex space-x-2">
                                {["", "competitive", "casual"].map((style) => (
                                    <label
                                        key={style}
                                        className="flex-1 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="style"
                                            value={style}
                                            checked={filters.style === style}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="px-4 py-2 text-center rounded-lg border border-white bg-bg text-white transition peer-checked:bg-[var(--bg)]">
                                            {normalizeStyle(style)}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        {/* Género */}
                        <fieldset className="space-y-2">
                            <legend className="font-medium">Género</legend>
                            <div className="flex space-x-2">
                                {gendersTeam.map((value) => (
                                    <label
                                        key={value}
                                        className="flex-1 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={value}
                                            checked={filters.gender === value}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="px-4 py-2 text-center rounded-lg border border-white bg-bg text-white transition peer-checked:bg-[var(--bg)]">
                                            {normalizeGenderTeam(value)}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </form>
                </div>
            </aside>

            {showModal && (
                <CreateTeamModal
                    user={user}
                    setShowModal={setShowModal}
                    onCreated={onCreated}
                />
            )}
        </>
    );
};

export default FilterAside;
