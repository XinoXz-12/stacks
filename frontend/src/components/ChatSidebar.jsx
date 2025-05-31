import React from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getProfilesByUser, getTeamsByProfile, getLastMessageByTeam } from "../services/stacks";
import useFetch from "../hooks/useFetch";
import { cleanBackendMessage } from "../helpers/normalizeFuctions.js";

const ChatSidebar = ({ setSelectedTeam, selectedTeam, refreshKey }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const fetchSidebarData = async () => {
        const { data: profiles } = await getProfilesByUser(user.id);
        const teamsResponses = await Promise.all(
            profiles.map((profile) => getTeamsByProfile(profile._id))
        );
        const allTeams = teamsResponses.flatMap((res) => res.data);

        const messageResults = await Promise.allSettled(
            allTeams.map((team) =>
                getLastMessageByTeam(team._id).then((res) => ({
                    teamId: team._id,
                    message: res.data,
                }))
            )
        );

        const messagesMap = {};
        for (const result of messageResults) {
            if (result.status === "fulfilled") {
                messagesMap[result.value.teamId] = result.value.message || null;
            }
        }

        return { teams: allTeams, messages: messagesMap };
    };

    const { data, loading, error } = useFetch(fetchSidebarData, [
        user?.id,
        refreshKey,
    ]); // 👉 dependencia añadida

    const teams = data?.teams || [];
    const lastMessages = data?.messages || {};

    if (error) {
        addToast(cleanBackendMessage(error), "error");
    }

    return (
        <div className="w-full overflow-y-auto">
            {teams.map((team) => {
                const lastMsg = lastMessages[team._id];
                const isActive = team._id === selectedTeam;

                return (
                    <div
                        key={team._id}
                        onClick={() => setSelectedTeam(team._id)}
                        className={`py-4 px-2 cursor-pointer border-b transition-colors duration-200 ${
                            isActive
                                ? "bg-[var(--prim)] text-white"
                                : "hover:bg-[var(--prim)]"
                        }`}
                    >
                        <div className="font-bold">{team.name}</div>
                        <div className="text-sm text-gray-300 truncate italic mt-1">
                            {lastMsg
                                ? `${
                                      lastMsg.senderId?.user_game || "Usuario"
                                  }: ${lastMsg.content}`
                                : "Sin mensajes"}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChatSidebar;
