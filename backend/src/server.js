import dotenv from "dotenv";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { handleSocketEvents } from "./sockets/socketHandler.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin:process.env.CORS_ORIGIN || "https://stacks-gg.duckdns.org",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.set("io", io);

io.on("connection", (socket) => handleSocketEvents(io, socket));

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en https://stacks-gg.duckdns.org/api/`);
    console.log("Variables de entorno:");
    console.log("PORT:", process.env.PORT);
    console.log(
        "MONGODB_URI:",
        process.env.MONGODB_URI ? "Configurada" : "No configurada"
    );
});
