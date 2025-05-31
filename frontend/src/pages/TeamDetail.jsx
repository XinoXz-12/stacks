import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import useFetch from "../hooks/useFetch";
import {
    getTeamById,
    getTeamMembers,
    getProfilesByUser,
    getRequestsByProfile,
    getRequestsByTeam,
    updateRequestStatus,
    removeRequest,
    removeTeamMember,
    deleteTeam,
    addRequest,
    getRanksData,
} from "../services/stacks";
import {
    normalizeStyle,
    normalizeServer,
    formatRankWithSubrank,
    normalizeGender,
    cleanBackendMessage,
} from "../helpers/normalizeFuctions";
import { gameBannerMap } from "../helpers/constantsData";
import { useToast } from "../context/ToastContext";

const TeamDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();

    const [userProfiles, setUserProfiles] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [requestPending, setRequestPending] = useState(false);
    const [requests, setRequests] = useState([]);
    const [confirmData, setConfirmData] = useState({
        show: false,
        action: null,
        title: "",
        description: "",
        confirmText: "Confirmar",
        cancelText: "Cancelar",
        type: "warning",
    });

    const { data: teamRes, loading: loadingTeam } = useFetch(
        () => getTeamById(id),
        [id]
    );

    const {
        data: membersRes,
        loading: loadingMembers,
        refetch: refetchMembers,
    } = useFetch(() => getTeamMembers(id), [id]);

    const { data: ranksRes, loading: loadingRanks } = useFetch(
        () => getRanksData(),
        []
    );

    const team = teamRes?.data || null;
    const members = membersRes || [];
    const ranksData = ranksRes?.data || [];

    const creator = useMemo(() => members?.[0] || null, [members]);
    const isMember = useMemo(
        () => members.some((m) => m.user_id?._id === user?.id),
        [members, user]
    );
    const isCreator = user?.id === creator?.user_id?._id;
    const isFull = members.length >= (team?.capacity || 0);
    const regionMatch = userProfile?.server === creator?.server;
    const canRequest =
        user && !isMember && !isFull && userProfile && !requestPending;

    const bannerImage = gameBannerMap[team?.game] || gameBannerMap["Valorant"];

    // Obtener perfiles de usuario y solicitudes
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user?.id || !team) return;

            try {
                const { data: profiles } = await getProfilesByUser(user.id);
                setUserProfiles(profiles);

                const profile = profiles.find((p) => p.game === team.game);
                setUserProfile(profile);

                if (profile?._id) {
                    const { data: userRequests } = await getRequestsByProfile(
                        profile._id
                    );
                    const alreadyRequested = userRequests.some(
                        (req) =>
                            req.team_id._id === team._id &&
                            req.status === "pending"
                    );
                    setRequestPending(alreadyRequested);
                }
            } catch (error) {
                addToast(cleanBackendMessage(error.message), "error");
            }
        };

        fetchProfileData();
    }, [user, team, addToast]);

    // Obtener solicitudes del creador
    useEffect(() => {
        const fetchTeamRequests = async () => {
            if (isCreator && team?._id) {
                try {
                    const { data } = await getRequestsByTeam(team._id);
                    const pending = data.filter((r) => r.status === "pending");
                    setRequests(pending);
                } catch (error) {
                    addToast(cleanBackendMessage(error.message), "error");
                }
            }
        };

        fetchTeamRequests();
    }, [isCreator, team, addToast]);

    const showConfirmation = ({
        action,
        title,
        description,
        confirmText = "Confirmar",
        type = "warning",
    }) => {
        setConfirmData({
            show: true,
            action,
            title,
            description,
            confirmText,
            cancelText: "Cancelar",
            type,
        });
    };

    const handleConfirm = async () => {
        if (confirmData.action) await confirmData.action();
        setConfirmData((prev) => ({ ...prev, show: false }));
    };

    const handleJoinRequest = async () => {
        try {
            await addRequest({ team_id: id, profile_id: userProfile._id });
            setRequestPending(true);
            addToast("Solicitud enviada", "success");
        } catch (error) {
            addToast(cleanBackendMessage(error.message), "error");
        }
    };

    const handleRequestAction = async (reqId, action) => {
        try {
            await updateRequestStatus(reqId, { status: action });
            setRequests((prev) => prev.filter((r) => r._id !== reqId));
            if (action === "accepted") {
                await refetchMembers();
                addToast("Solicitud aceptada", "success");
            }
        } catch (error) {
            addToast(cleanBackendMessage(error.message), "error");
        }
    };

    const handleCancelRequest = async () => {
        try {
            const { data: userRequests } = await getRequestsByProfile(
                userProfile._id
            );
            const req = userRequests.find(
                (r) => r.team_id._id === team._id && r.status === "pending"
            );
            if (req?._id) {
                await removeRequest(req._id);
                setRequestPending(false);
                addToast("Solicitud cancelada", "success");
            }
        } catch (error) {
            addToast(cleanBackendMessage(error.message), "error");
        }
    };

    const handleLeaveTeam = async () => {
        try {
            await removeTeamMember(team._id, userProfile._id);
            addToast("Stack abandonado", "success");
            navigate("/teams");
        } catch (error) {
            addToast(cleanBackendMessage(error.message), "error");
        }
    };

    const handleKickMember = async (profileId) => {
        try {
            await removeTeamMember(team._id, profileId);
            addToast("Miembro expulsado", "success");
            refetchMembers();
        } catch (error) {
            addToast(cleanBackendMessage(error.message), "error");
        }
    };

    const handleDeleteTeam = async () => {
        try {
            await deleteTeam(team._id);
            addToast("Stack eliminada", "success");
            navigate("/teams");
        } catch (error) {
            addToast(cleanBackendMessage(error.message), "error");
        }
    };

    if (loadingTeam || loadingMembers || loadingRanks)
        return <LoadingSpinner />;
    if (!team) {
        addToast("Stack no encontrada", "error");
        navigate("/teams");
        return null;
    }

    return (
        <article className="container mx-auto px-4">
            <header
                className="relative h-[200px] w-full rounded-b-lg overflow-hidden mb-6 shadow"
                style={{
                    backgroundImage: `url(${bannerImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundBlendMode: "soft-light",
                    backgroundColor: "var(--sec)",
                }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 h-full flex items-end px-6 pb-4">
                    <h1 className="text-4xl font-bold text-white [text-shadow:1px_1px_5px_var(--black)]">
                        {team.name}
                    </h1>
                </div>
            </header>

            <section className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3 mb-6">
                <aside className="bg-[var(--sec)] py-6 px-12 rounded-lg shadow space-y-2 text-white">
                    <p>
                        <i className="fa-solid fa-gamepad text-lg text-hovered"></i>
                        <span className="text-lg p-2 bold">Juego: </span>{" "}
                        {team.game}
                    </p>
                    <p>
                        <i className="fa-solid fa-venus-mars text-lg text-hovered"></i>
                        <span className="text-lg p-2 bold">Género: </span>{" "}
                        {normalizeGender(team.gender)}
                    </p>
                    <p>
                        <i className="fa-solid fa-trophy text-lg text-hovered"></i>
                        <span className="text-lg p-2 bold">Estilo: </span>{" "}
                        {normalizeStyle(creator?.style) || "N/A"}
                    </p>
                    <p>
                        <i className="fa-solid fa-location-dot text-lg text-hovered"></i>
                        <span className="text-lg p-3 bold"> Región: </span>{" "}
                        {normalizeServer(creator?.server) || "N/A"}
                    </p>
                    <p>
                        <i className="fa-solid fa-users text-lg text-hovered"></i>
                        <span className="text-lg p-2 bold">Miembros: </span>{" "}
                        {members.length}/{team.capacity}
                    </p>
                    <p>
                        <i className="fa-solid fa-medal text-lg text-hovered"></i>
                        <span className="text-lg p-2 bold">Rango: </span>{" "}
                        {formatRankWithSubrank(
                            team.game,
                            creator?.rank,
                            creator?.subrank,
                            ranksData
                        )}
                    </p>

                    {canRequest && (
                        <button
                            onClick={handleJoinRequest}
                            disabled={!regionMatch}
                            className={`w-full mt-4 px-4 py-2 rounded-md font-semibold btn ${
                                regionMatch
                                    ? "bg-[var(--prim)] hover:bg-[var(--prim-hover)] text-white"
                                    : "bg-gray-400 text-white cursor-not-allowed"
                            }`}
                        >
                            Solicitar unión
                        </button>
                    )}
                    {requestPending && (
                        <div className="mt-4">
                            <button
                                onClick={() =>
                                    showConfirmation({
                                        title: "¿Cancelar solicitud?",
                                        description:
                                            "Ya no formarás parte de la lista de espera.",
                                        type: "danger",
                                        confirmText: "Cancelar",
                                        action: handleCancelRequest,
                                    })
                                }
                                className="w-full mt-4 px-4 py-2 rounded-md border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold justify-center btn"
                            >
                                Cancelar solicitud
                            </button>
                            <p className="text-sm text-yellow-300 italic mt-2">
                                Ya has enviado una solicitud.
                            </p>
                        </div>
                    )}
                    {isMember && !isCreator && (
                        <button
                            onClick={() =>
                                showConfirmation({
                                    title: "¿Abandonar stack?",
                                    description:
                                        "Ya no formarás parte de la stack.",
                                    type: "warning",
                                    confirmText: "Abandonar",
                                    action: () => handleLeaveTeam(),
                                })
                            }
                            className="w-full mt-4 px-4 py-2 rounded-md border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold justify-center btn"
                        >
                            Abandonar Stack
                        </button>
                    )}
                    {isCreator && members.length <= 1 && (
                        <button
                            onClick={() =>
                                showConfirmation({
                                    title: "¿Eliminar stack?",
                                    description:
                                        "Esta acción no se puede deshacer.",
                                    type: "danger",
                                    confirmText: "Eliminar",
                                    action: handleDeleteTeam,
                                })
                            }
                            className="w-full mt-4 px-4 py-2 rounded-md border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold justify-center btn"
                        >
                            Eliminar Stack
                        </button>
                    )}
                </aside>

                {/* Members */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4 text-white">
                        Miembros
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.map((member) => (
                            <div
                                key={member._id}
                                className="bg-[var(--sec)] text-white py-6 px-12 rounded-md shadow flex flex-col gap-1"
                            >
                                <span className="text-lg font-semibold">
                                    {member.user_game}
                                </span>
                                <span>
                                    Edad: {member.user_id?.age ?? "N/A"} años
                                </span>
                                <span>
                                    Rango:{" "}
                                    {formatRankWithSubrank(
                                        team.game,
                                        member.rank,
                                        member.subrank,
                                        ranksData
                                    )}
                                </span>

                                <span>
                                    Región: {normalizeServer(member.server)}
                                </span>
                                <span>
                                    Estilo: {normalizeStyle(member.style)}
                                </span>

                                {isCreator &&
                                    user?.id !== member.user_id?._id && (
                                        <button
                                            onClick={() =>
                                                showConfirmation({
                                                    title: "¿Expulsar miembro?",
                                                    description:
                                                        "El usuario será removido del stack.",
                                                    type: "danger",
                                                    confirmText: "Expulsar",
                                                    action: () =>
                                                        handleKickMember(
                                                            member.profile_id ||
                                                                member._id
                                                        ),
                                                })
                                            }
                                            className="mt-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-1 rounded transition-all duration-300 transform hover:scale-105"
                                        >
                                            Expulsar
                                        </button>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requests */}
            {isCreator && requests.length > 0 && (
                <section className="bg-[var(--sec)] text-white p-4 rounded-lg shadow space-y-4 mb-10">
                    <h2 className="text-xl font-bold">
                        Solicitudes pendientes
                    </h2>
                    {requests.map((req) => {
                        const profile = req.profile_id;

                        return (
                            <div
                                key={req._id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-black/20 p-4 rounded-md"
                            >
                                <div className="text-white space-y-1">
                                    <p className="font-bold text-lg">
                                        {profile?.user_game ||
                                            "Usuario desconocido"}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <p>
                                            <span className="text-lg p-2 bold">
                                                Rango:
                                            </span>
                                            {formatRankWithSubrank(
                                                team.game,
                                                profile.rank,
                                                profile.subrank,
                                                ranksData
                                            )}
                                        </p>

                                        <p>
                                            <span className="text-lg p-2 bold">
                                                Estilo:
                                            </span>
                                            {normalizeStyle(profile.style)}
                                        </p>
                                        <p>
                                            <span className="text-lg p-2 bold">
                                                Género:
                                            </span>
                                            {normalizeGender(
                                                profile.user_id?.gender
                                            )}
                                        </p>
                                        <p>
                                            <span className="text-lg p-2 bold">
                                                Edad:
                                            </span>
                                            {profile.user_id?.age}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4">
                                    <button
                                        className="bg-[var(--prim)] text-white px-4 py-2 rounded-lg hover:bg-[var(--prim-hover)] transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium shadow-md hover:shadow-lg btn"
                                        onClick={() =>
                                            showConfirmation({
                                                title: "¿Aceptar solicitud?",
                                                description:
                                                    "El jugador se unirá a la stack.",
                                                type: "info",
                                                confirmText: "Aceptar",
                                                action: () =>
                                                    handleRequestAction(
                                                        req._id,
                                                        "accepted"
                                                    ),
                                            })
                                        }
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        className="border-2 border-red-500 text-red-500 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium btn"
                                        onClick={() =>
                                            showConfirmation({
                                                title: "¿Rechazar solicitud?",
                                                description:
                                                    "El jugador no se unirá a la stack.",
                                                type: "danger",
                                                confirmText: "Rechazar",
                                                action: () =>
                                                    handleRequestAction(
                                                        req._id,
                                                        "rejected"
                                                    ),
                                            })
                                        }
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </section>
            )}
            <ConfirmModal
                show={confirmData.show}
                onClose={() =>
                    setConfirmData((prev) => ({ ...prev, show: false }))
                }
                onConfirm={handleConfirm}
                title={confirmData.title}
                description={confirmData.description}
                confirmText={confirmData.confirmText}
                cancelText={confirmData.cancelText}
                type={confirmData.type}
            />
        </article>
    );
};

export default TeamDetail;
