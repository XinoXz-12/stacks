import React, { useMemo, useState, useEffect } from "react";
import FilterAside from "../components/FilterAside";
import TeamCard from "../components/TeamCard";
import Carousel from "../components/Carousel";
import LoadingSpinner from "../components/LoadingSpinner";
import { getAllTeams, getRanksData } from "../services/stacks";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { cleanBackendMessage } from "../helpers/normalizeFuctions";
import useFetch from "../hooks/useFetch";

const TeamList = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [filters, setFilters] = useState({
        game: "Valorant",
        gender: "",
        style: "",
        region: "",
        minAge: 0,
        maxAge: 100,
        minRank: "",
        maxRank: "",
        minPlayers: 0,
        maxPlayers: 5,
    });

    // Memo for stable filters
    const stableFilters = useMemo(
        () => filters,
        [
            filters.game,
            filters.gender,
            filters.style,
            filters.region,
            filters.minAge,
            filters.maxAge,
            filters.minRank,
            filters.maxRank,
            filters.minPlayers,
            filters.maxPlayers,
        ]
    );

    // Fetch teams
    const {
        data: teamResponse,
        loading: loadingTeams,
        error: errorTeams,
        refetch: refetchTeams,
    } = useFetch(() => getAllTeams(stableFilters), [stableFilters]);

    // Fetch ranks
    const {
        data: ranksResponse,
        loading: loadingRanks,
        error: errorRanks,
    } = useFetch(() => getRanksData(), []);

    // Teams
    const teams = useMemo(() => {
        if (!teamResponse?.data) return [];
        return teamResponse.data.filter(
            (team) => team.members.length < team.capacity
        );
    }, [teamResponse]);

    // Ranks
    const ranksData = ranksResponse?.data || [];

    // Error
    useEffect(() => {
        if (errorTeams) addToast(cleanBackendMessage(errorTeams), "error");
        if (errorRanks) addToast(cleanBackendMessage(errorRanks), "error");
    }, [errorTeams, errorRanks, addToast]);

    // Handle team created
    const handleTeamCreated = () => {
        refetchTeams();
    };

    return (
        <main className="container mx-auto px-4 w-screen">
            {/* Carousel */}
            <div className="relative w-screen max-w-none left-1/2 transform -translate-x-1/2 overflow-hidden">
                <Carousel
                    onGameChange={(selectedGame) =>
                        setFilters((prev) => ({ ...prev, game: selectedGame }))
                    }
                />
            </div>

            <section className="flex flex-col lg:flex-row gap-12 mt-8">
                {/* Filter aside */}
                <FilterAside
                    filters={filters}
                    setFilters={setFilters}
                    user={user}
                    onCreated={handleTeamCreated}
                    addToast={addToast}
                />

                {/* Teams list */}
                <section className="flex-1 mb-8">
                    {loadingTeams || loadingRanks ? (
                        <LoadingSpinner />
                    ) : teams.length === 0 ? (
                        <p className="text-center text-white/70 mt-6 italic">
                            No se encontraron equipos.
                        </p>
                    ) : (
                        <div className="w-full flex flex-col items-center gap-5 sm:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:justify-items-center">
                            {/* Teams cards */}
                            {teams.map((team) => (
                                <TeamCard
                                    key={team._id}
                                    team={team}
                                    ranksData={ranksData}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
};

export default TeamList;
