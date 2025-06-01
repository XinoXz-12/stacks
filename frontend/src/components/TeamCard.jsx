import React from "react";
import { Link } from "react-router-dom";
import Badges from "./Badges";
import {
    formatRankWithSubrank,
    getAverageAge,
    normalizeGenderTeam,
} from "../helpers/normalizeFuctions";

const TeamCard = ({ team, ranksData }) => {
    if (!team) return null;

    const { _id, name, game, gender, capacity, members = [] } = team;
    const member = members[0] || {};

    return (
        
        <Link to={`/team/${_id}`} className="group">
            <article className="bg-[var(--bg)] text-[var(--white)] border-2 border-[var(--prim)] rounded-lg shadow-lg w-fit min-w-[350px] max-w-full p-5 relative overflow-hidden hover-effect hover:bg-[var(--sec)]">
                {/* Team name and members */}
                <div className="p-2">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-2xl font-semibold text-white text-hovered">
                            {name}
                        </h2>
                        <span className="text-sm text-white/70 flex items-center">
                            <i
                                className="fa-solid fa-users mr-2"
                                style={{ color: "var(--prim)" }}
                            ></i>
                            {members.length}/{capacity}
                        </span>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <Badges game={game} />
                        <Badges server={member.server} />
                        <Badges style={member.style} />
                    </div>

                    {/* Info extra */}
                    <div className="text-sm text-white/70 space-y-1 mt-4">
                        <p className="flex items-center">
                            {gender === "F" ? (
                                <i className="fa-solid fa-venus mr-2"></i>
                            ) : (
                                <i className="fa-solid fa-venus-mars mr-2"></i>
                            )}
                            {normalizeGenderTeam(gender)}
                        </p>
                        <p className="flex items-center">
                            <i className="fa-solid fa-calendar-days mr-2"></i>
                            {getAverageAge(members)} años
                        </p>
                        <p className="flex items-center">
                            <i className="fa-solid fa-medal mr-2"></i>
                            {formatRankWithSubrank(
                                game,
                                member.rank,
                                member.subrank,
                                ranksData
                            )}
                        </p>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default TeamCard;
