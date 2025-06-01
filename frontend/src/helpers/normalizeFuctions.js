// Validate image to show rounded or not
export const validateImage = (image) => {
    if (image && !image.includes("jidenticon")) {
        return "rounded-full";
    }
};

// Normalize style
export const normalizeStyle = (style) => {
    if (style === "competitive") return "Competitivo";
    if (style === "casual") return "Casual";
    if (style === "") return "Todos";
};

// Normalize server
export const normalizeServer = (server) => {
    switch (server) {
        case "NA":
            return "Norte América";
        case "EU":
            return "Europa";
        case "LATAM":
            return "Latinoamérica";
        case "BR":
            return "Brasil";
        case "AP":
            return "Asia Pacífico";
        case "KR":
            return "Corea";
        default:
            return server;
    }
};

// Format rank with subrank
export const formatRankWithSubrank = (game, rank, subrank, ranksData) => {
    if (!rank || !game || !subrank || !ranksData) return rank;

    const config = ranksData[game];
    if (!config) return rank;

    const subrankRules = config.subranks || {};
    const allowedSubranks = subrankRules[rank] ?? subrankRules.default ?? 0;

    return allowedSubranks === 1 ? rank : `${rank} ${subrank}`;
};

// Normalize gender
export const normalizeGender = (gender) => {
    return gender === "F" ? "Femenino" : gender === "M" ? "Masculino" : "Otro";
};

// Normalize game
export const normalizeGame = (game) => {
    switch (game) {
        case "Valorant":
            return "Valorant";
        case "LoL":
            return "League of Legends";
        case "Overwatch":
            return "Overwatch 2";
        case "Fortnite":
            return "Fortnite";
        default:
            return game;
    }
};

// Normalize gender for team
export const normalizeGenderTeam = (gender) => {
    if (gender === "F") return "Femenino";
    if (gender === "Mixto") return "Mixto";
    if (gender === "") return "Todos";
};

// Format date for messages
export const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    const optionsDate = {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Madrid",
    };

    const optionsTime = {
        hour: "2-digit",
        minute: "2-digit",
    };

    const dateFormated = date.toLocaleDateString("es-ES", optionsDate);
    const timeFormated = date.toLocaleTimeString("es-ES", optionsTime);

    return `${timeFormated}, ${dateFormated}`;
};

// Get average age
export const getAverageAge = (members) => {
    const totalAge = members.reduce(
        (acc, member) => acc + member.user_id.age,
        0
    );
    return totalAge / members.length;
};

// Capitalize string
export const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

// Convert number to roman
export const toRoman = (num) => {
    const map = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" };
    return map[num] || String(num);
};

// Get subranks for rank
export const getSubranksFor = (rank, dataGame) => {
    const count =
        dataGame?.subranks?.[rank] ?? dataGame?.subranks?.default ?? 1;
    const result = [];

    for (let i = 1; i <= count; i++) {
        result.push(String(i));
    }

    return result;
};

// Check if has subranks
export const hasSubranks = (rank, dataGame) => {
    const count =
        dataGame?.subranks?.[rank] ?? dataGame?.subranks?.default ?? 1;
    return count > 1;
};

// Clean backend message
export const cleanBackendMessage = (msg) => {
    if (!msg) return "Error desconocido";

    if (typeof msg !== "string") {
        try {
            if (msg instanceof Error && msg.message) {
                return msg.message;
            }

            const parsed =
                typeof msg.json === "function"
                    ? {}
                    : JSON.parse(msg);

            if (parsed.message) {
                msg = parsed.message;
            } else {
                return "Error desconocido";
            }
        } catch (err) {
            return "Error del servidor (respuesta no válida)";
        }
    }

    if (typeof msg !== "string") return "Error desconocido";

    return msg.replace(/^(#.*?#\s*)+/, "").trim();
};
