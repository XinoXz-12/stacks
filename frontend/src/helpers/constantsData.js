import banner_fortnite from "../assets/images/banner_fortnite.png";
import logo_fortnite from "../assets/images/fortnite.png";
import banner_lol from "../assets/images/banner_lol.png";
import logo_lol from "../assets/images/lol.png";
import banner_overwatch from "../assets/images/banner_overwatch.png";
import logo_overwatch from "../assets/images/overwatch.png";
import banner_valorant from "../assets/images/banner_valorant.png";
import logo_valorant from "../assets/images/valorant.png";

export const features = [
    {
        title: "Juegos no tóxicos",
        description:
            "Encuentra compañeros perfectos según tu rango, nivel y estilo de juego.",
        icon: "🎮",
    },
    {
        title: "Conexión instantánea al juego",
        description:
            "Con sincronización automática de estado e invitaciones grupales instantáneas, nunca más necesitarás pedir una etiqueta con nombre.",
        icon: "📅",
    },
    {
        title: "Hecho para todos",
        description:
            "No importa cuál sea tu rango, encuentra a tu equipo aquí. ¡Tenemos un lugar para todos!",
        icon: "🤝",
    },
];

export const faqs = [
    {
        question: "¿Qué es Stack?",
        answer: "Stack es una plataforma social diseñada para unir a jugadores que buscan hacer nuevos amigos y compartir experiencias de juego emocionantes.",
    },
    {
        question: "¿Cómo puedo encontrar otros jugadores?",
        answer: "Puedes buscar jugadores por juego, región, rango, edad o género. ¡Nuestro sistema de matchmaking te ayudará a encontrar compañeros perfectos!",
    },
    {
        question: "¿Es gratis usar la plataforma?",
        answer: "Sí, la plataforma es completamente gratuita. Todos los servicios son completamente gratuitos. No hay ningún tipo de costo oculto.",
    },
    {
        question: "¿Qué juegos están soportados?",
        answer: "Nuestros juegos actualmente se basan en shooters, pero estamos trabajando para expandir nuestra lista de juegos.",
    },
];

export const styles = ["casual", "competitive"];
export const servers = ["NA", "EU", "LATAM", "BR", "AP", "KR"];

export const slides = [
    {
        id: 1,
        title: "VALORANT",
        game: "Valorant",
        banner: banner_valorant,
        logo: logo_valorant,
    },
    {
        id: 2,
        title: "LEAGUE OF LEGENDS",
        game: "LoL",
        banner: banner_lol,
        logo: logo_lol,
    },
    {
        id: 3,
        title: "OVERWATCH 2",
        game: "Overwatch",
        banner: banner_overwatch,
        logo: logo_overwatch,
    },
    {
        id: 4,
        title: "FORTNITE",
        game: "Fortnite",
        banner: banner_fortnite,
        logo: logo_fortnite,
    },
];

export const gameBannerMap = {
    Valorant: banner_valorant,
    LoL: banner_lol,
    Overwatch: banner_overwatch,
    Fortnite: banner_fortnite,
};

export const gendersTeam = ["", "F", "Mixto"];

export const typeStyles = {
    danger: {
        color: "bg-red-600 hover:bg-red-700",
        icon: "fa-solid fa-trash",
    },
    info: {
        color: "bg-[var(--prim)] hover:bg-[var(--prim-hover)]",
        icon: "fa-solid fa-circle-info",
    },
    warning: {
        color: "bg-yellow-500 hover:bg-yellow-600 text-black",
        icon: "fa-solid fa-exclamation-triangle",
    }
};