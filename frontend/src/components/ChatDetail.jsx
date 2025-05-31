import React, { useEffect, useRef, useState, useMemo } from "react";
import {
    getMessagesByTeam,
    sendMessage,
    getTeamById,
} from "../services/stacks";
import { useAuth } from "../context/AuthContext";
import { socket } from "../helpers/socket";
import { useToast } from "../context/ToastContext";
import { formatDate, cleanBackendMessage } from "../helpers/normalizeFuctions";
import useFetch from "../hooks/useFetch";

const ChatDetail = ({ teamId, onNewMessage }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const bottomRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");

    // Obtener mensajes
    const {
        data: fetchedMessages,
        loading: loadingMessages,
        error: errorMessages,
    } = useFetch(
        () => getMessagesByTeam(teamId).then((res) => res?.data),
        [teamId]
    );

    // Obtener equipo
    const {
        data: team,
        loading: loadingTeam,
        error: errorTeam,
    } = useFetch(() => getTeamById(teamId).then((res) => res.data), [teamId]);

    // Determinar mi perfil dentro del equipo
    const myProfile = useMemo(() => {
        if (!team || !user?.id) return null;
        return team.members.find((m) => m.user_id._id === user.id);
    }, [team, user?.id]);

    // Aplicar mensajes al useState
    useEffect(() => {
        if (fetchedMessages) setMessages(fetchedMessages);
    }, [fetchedMessages]);

    // Scroll automático al fondo
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // WebSocket: suscripción a nuevos mensajes
    useEffect(() => {
        if (!teamId) return;

        socket.emit("join", teamId);

        const handleMessage = (message) => {
            if (message.teamId === teamId) {
                setMessages((prev) => [...prev, message]);
            }
        };

        socket.on("newMessage", handleMessage);

        return () => {
            socket.off("newMessage", handleMessage);
            socket.emit("leave", teamId);
        };
    }, [teamId]);

    // Envío de mensajes
    const send = () => {
        if (!myProfile?._id || !teamId || !content.trim()) {
            addToast("Faltan datos para enviar el mensaje", "error");
            return;
        }

        sendMessage(teamId, {
            senderId: myProfile._id,
            content,
        })
            .then((res) => {
                setMessages((prev) => [...prev, res.data]);
                setContent("");
                onNewMessage?.();
            })
            .catch((error) => {
                addToast(cleanBackendMessage(error.message), "error");
            });
    };

    // Mostrar errores de fetch
    useEffect(() => {
        if (errorMessages)
            addToast(cleanBackendMessage(errorMessages), "error");
        if (errorTeam) addToast(cleanBackendMessage(errorTeam), "error");
    }, [errorMessages, errorTeam, addToast]);

    return (
        <div className="flex flex-col h-full bg-[var(--bg)] rounded-lg">
            {/* Header */}
            <div className="p-4 border-b text-xl font-semibold shadow">
                {loadingTeam ? "Cargando..." : team?.name || "Sin equipo"}
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 min-h-0">
                {loadingMessages ? (
                    <p className="text-center text-gray-400 italic">
                        Cargando mensajes...
                    </p>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 italic">
                        Aún no hay mensajes
                    </div>
                ) : (
                    messages.map((msg) => {
                        if (!msg || !msg.senderId) return null;

                        const sender = msg.senderId;
                        const isPopulated = typeof sender === "object";
                        const senderId = isPopulated ? sender._id : sender;
                        const senderName = isPopulated
                            ? sender.user_game
                            : "Usuario";
                        const myMessage = senderId === myProfile?._id;

                        return (
                            <div
                                key={msg._id}
                                className={`max-w-[45vh] p-2 rounded-lg mb-2 ${
                                    myMessage
                                        ? "ml-auto bg-[var(--prim)]"
                                        : "mr-auto bg-[var(--sec)]"
                                }`}
                            >
                                <div className="text-sm font-semibold mb-1">
                                    {senderName}
                                </div>
                                <div className="text-base break-words">
                                    {msg.content}
                                </div>
                                <div className="text-xs text-right mt-1 text-gray-300 italic">
                                    {formatDate(msg.date)}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t flex items-center">
                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            send();
                        }
                    }}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 border border-[var(--prim)] rounded px-4 py-2 mr-2 focus:bg-[var(--sec)]"
                />
                <button
                    onClick={send}
                    disabled={!myProfile || !content.trim()}
                    className={`py-2 px-4 rounded border-2 ${
                        content.trim()
                            ? "bg-[var(--prim)] text-white border-[var(--prim)] hover:bg-[var(--bg)]"
                            : "bg-gray-400 text-white border-gray-400 cursor-not-allowed"
                    }`}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default ChatDetail;
