export function handleSocketEvents(io, socket) {
    console.log("🔌 Cliente conectado:", socket.id);

    socket.on("join", (teamId) => {
        socket.join(teamId);
        console.log(
            `🟢 Cliente ${socket.id} se unió a la sala del equipo ${teamId}`
        );
    });

    socket.on("leave", (teamId) => {
        socket.leave(teamId);
        console.log(
            `🟡 Cliente ${socket.id} salió de la sala del equipo ${teamId}`
        );
    });

    socket.on("sendMessage", (message) => {
        io.to(message.teamId).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("❌ Cliente desconectado:", socket.id);
    });
}
