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
        origin:process.env.CORS_ORIGIN || "http://ec2-13-219-93-135.compute-1.amazonaws.com",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.set("io", io);

io.on("connection", (socket) => handleSocketEvents(io, socket));

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log("Variables de entorno:");
    console.log("PORT:", process.env.PORT);
    console.log(
        "MONGODB_URI:",
        process.env.MONGODB_URI ? "Configurada" : "No configurada"
    );
    console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
});
