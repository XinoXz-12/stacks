import ranksByGame from "../helpers/ranksByGame.js";
import { VALID_STYLES, VALID_SERVERS } from "./enumsValid.js";

export const getGender = (members) => {
    return members.every((member) => member.gender === "F") ? "F" : "Mixto";
};

export const getAverageAge = (members) => {
    const ages = members
        .map((member) => member.user_id?.age)
        .filter((age) => typeof age === "number");

    if (ages.length === 0) return 0;

    const totalAge = ages.reduce((acc, age) => acc + age, 0);
    return totalAge / ages.length;
};

export const capacityForTeam = (game) => {
    if (!ranksByGame[game]) {
        return { valid: false, message: `El juego ${game} no está soportado` };
    }

    const capacity = ranksByGame[game].capacity;

    return capacity;
};

export const validateRank = (game, rank, subrank) => {
    if (!ranksByGame[game]) {
        return { valid: false, message: `El juego ${game} no está soportado` };
    }

    if (!ranksByGame[game].ranks.includes(rank)) {
        return {
            valid: false,
            message: `El rango ${rank} no es válido para ${game}`,
        };
    }

    const maxSub =
        ranksByGame[game].subranks[rank] || ranksByGame[game].subranks.default;
    if (subrank < 1 || subrank > maxSub) {
        return {
            valid: false,
            message: `El subrango ${subrank} no es válido para el rango ${rank} en ${game}. Debe ser un número entre 1 y ${maxSub}`,
        };
    }

    return { valid: true, maxSub };
};

export const validateProfileData = (data) => {
    const { game, rank, style, server } = data;
    let { subrank } = data;

    if (typeof subrank === "string") {
        subrank = parseInt(subrank, 10);
    }

    const errors = [];

    if (!game || !rank || !subrank || !style || !server) {
        errors.push("#validateProfileData# Todos los campos son requeridos");
    }

    if (!VALID_STYLES.includes(style)) {
        errors.push(
            "#validateProfileData# El estilo debe ser casual o competitivo"
        );
    }

    if (!VALID_SERVERS.includes(server)) {
        errors.push(
            "#validateProfileData# El servidor debe ser NA, EU, LATAM, BR, AP, KR"
        );
    }

    const rankValidation = validateRank(game, rank, subrank);
    if (!rankValidation.valid) {
        errors.push(rankValidation.message);
    }

    return errors;
};

export const stripHtml = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
};

export const extractImageUrl = (html) => {
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : PLACEHOLDER_IMAGE;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export const getPlaceholderImage = (game) => {
    let gameName;

    switch (game) {
        case "valorant":
            gameName = "Valorant";
            break;
        case "leagueoflegends":
            gameName = "League of Legends";
            break;
        case "overwatch":
            gameName = "Overwatch";
            break;
        case "fortnite":
            gameName = "Fortnite";
            break;
        default:
            gameName = "Sin Imagen";
            break;
    }

    return `https://placehold.co/300x200?text=${encodeURIComponent(
        gameName
    )}%0A©Stacks`;
};

export const errorResponse = (res, message, status = 500, error = null) => {
    return res.status(status).json({
        success: false,
        message,
        error: error ? error.message || error : undefined,
    });
}

export const buildTeamFilters = (query) => {
    const { game, gender } = query;

    const filters = {};

    if (game) filters.game = game;
    if (gender === "F" || gender === "Mixto") filters.gender = gender;

    return filters;
}
