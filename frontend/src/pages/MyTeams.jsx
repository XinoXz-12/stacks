import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    getProfilesByUser,
    getTeamsByProfile,
    getRanksData,
} from "../services/stacks";
import TeamCard from "../components/TeamCard";
import Carousel from "../components/Carousel";
import LoadingSpinner from "../components/LoadingSpinner";
import {
    normalizeGame,
    cleanBackendMessage,
} from "../helpers/normalizeFuctions";
import { useToast } from "../context/ToastContext";
import useFetch from "../hooks/useFetch";

const MyTeams = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [game, setGame] = useState("Valorant");
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);

    // Fetch profiles
    const {
        data: profilesData,
        loading: loadingProfiles,
        error: errorProfiles,
    } = useFetch(() => getProfilesByUser(user.id), [user]);
    const profiles = profilesData?.data || [];

    // Fetch ranks
    const {
        data: ranksData,
        loading: loadingRanks,
        error: errorRanks,
    } = useFetch(() => getRanksData(), []);
    const ranks = ranksData?.data || [];

    // Fetch teams by profile
    useEffect(() => {
        const fetchTeams = async () => {
            if (!profiles || !Array.isArray(profiles)) return;

            try {
                const allTeams = [];

                for (const profile of profiles) {
                    const { data: profileTeams } = await getTeamsByProfile(
                        profile._id
                    );
                    allTeams.push(...profileTeams);
                }

                setTeams(allTeams);
            } catch (error) {
                console.error(error);
                addToast(cleanBackendMessage(error.message), "error");
                setTeams([]);
            }
        };

        fetchTeams();
    }, [profiles, addToast]);

    // Filter teams by current game
    useEffect(() => {
        const filtered = teams.filter((team) => team.game === game);
        setFilteredTeams(filtered);
    }, [game, teams]);

    const loading = loadingProfiles || loadingRanks;

    return (
        <>
            {/* Loading */}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <main className="container mx-auto px-4 w-screen">
                    {/* Carousel */}
                    <div className="relative w-screen max-w-none left-1/2 transform -translate-x-1/2 overflow-hidden">
                        <Carousel
                            onGameChange={(selectedGame) =>
                                setGame(selectedGame)
                            }
                        />
                    </div>

                    <section className="flex flex-col lg:flex-row gap-12 mt-8">
                        {/* Teams */}
                        <section className="flex-1 mb-8">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Mis Stacks en {normalizeGame(game)}
                            </h2>

                            {filteredTeams.length === 0 ? (
                                <p className="text-white/70 italic mt-6">
                                    No estás en Stacks de este juego.
                                </p>
                            ) : (
                                <div className="w-full flex flex-col items-center gap-5 sm:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:justify-items-center">
                                    {filteredTeams.map((team) => (
                                        <TeamCard
                                            key={team._id}
                                            team={team}
                                            ranksData={ranks}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </section>
                </main>
            )}
        </>
    );
};

export default MyTeams;
