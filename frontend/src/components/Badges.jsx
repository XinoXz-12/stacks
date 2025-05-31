import React from 'react'

const Badges = ({ game, server, style }) => {

    switch (game) {
        case "Valorant":
            return (
                <span className="px-2 py-1 text-xs rounded-xl bg-[#ff0000] text-white">
                    Valorant
                </span>
            )
        case "LoL":
            return (
                <span className="px-2 py-1 text-xs rounded-xl bg-[#02424f] text-white">
                    League of Legends
                </span>
            )
        case "Overwatch":
            return (
                <span className="px-2 py-1 text-xs rounded-xl bg-[#ff6600] text-black">
                    Overwatch 2
                </span>
            )
        case "Fortnite":
            return (
                <span className="px-2 py-1 text-xs rounded-xl bg-[#882dff] text-white">
                    Fortnite
                </span>
            )
    }

    switch (server) {
        case "NA":
            return (
                <span className="px-2 py-1 text-xs rounded-xl bg-[#bea328] text-white">
                    América del Norte
                </span>
            )
        case "EU":
            return (
                <span className="px-2 py-1 text-xs rounded-xl bg-[#09328b] text-white">
                    Europa
                </span>
            )
        case "LATAM":
            return (
                <span className="px-2 py-1 text-xs rounded-xl bg-[#27e016] text-black">
                    Latinoamérica
                </span>
            )
        case "BR":
            return (
                <span className="px-2 py-1 text-xs rounded-xl bg-[#105f09] text-white">
                    Brasil
                </span>
            )
        case "AP":
            return (
                <span className="px-2 py-1 text-xs rounded-xl bg-[#8d1669] text-white">
                    Asia Pacífico
                </span>
            )
        case "KR":
            return (
                <span className="px-2 py-1 text-xs rounded-xl bg-[#78c1ff] text-black">
                    Corea del Sur
                </span>
            )
    }

    switch (style) {
        case "competitive":
            return (
                <span className="px-2 py-1 text-xs rounded-xl bg-[#ffc107] text-black">
                    Competitivo
                </span>
            )
        case "casual":
            return (
                <span className="px-2 py-1 text-xs rounded-xl bg-[#d6b2d0] text-black">
                    Casual
                </span>
            )
    }
}

export default Badges;
