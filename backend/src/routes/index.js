import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import profileRoutes from "./profileRoutes.js";
import teamRoutes from "./teamRoutes.js";
import requestRoutes from "./requestRoutes.js";
import membersRoutes from "./membersRoutes.js";
import chatRoutes from "./chatRoutes.js";
import newsRoutes from "./newsRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import ranksRoutes from "./ranksRoutes.js";

export default function registerRoutes(app) {
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/profiles", profileRoutes);
    app.use("/api/teams", teamRoutes);
    app.use("/api/requests", requestRoutes);
    app.use("/api/members", membersRoutes);
    app.use("/api/chat", chatRoutes);
    app.use("/api/news", newsRoutes);
    app.use("/api/upload", uploadRoutes);
    app.use("/api/ranks", ranksRoutes);
}
