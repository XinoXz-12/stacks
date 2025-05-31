import React, { useState, useEffect } from "react";
import { updateProfile } from "../services/stacks";
import { styles, servers } from "../helpers/constantsData";
import {
    capitalize,
    toRoman,
    normalizeGame,
    getSubranksFor,
    hasSubranks,
    cleanBackendMessage,
} from "../helpers/normalizeFuctions";
import { useToast } from "../context/ToastContext";
import useFetch from "../hooks/useFetch";
import { getRanksData } from "../services/stacks";

const ProfileCard = ({ profile, onSave, isNew = false, handleDelete }) => {
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editProfile, setEditProfile] = useState(profile);
    const [game, setGame] = useState(profile.game);

    const {
        data: ranksData,
        loading: loadingRanks,
        error: ranksError,
    } = useFetch(getRanksData, []);
    const ranksAll = ranksData?.data || {};

    useEffect(() => {
        setEditProfile(profile);
        setGame(profile.game);
    }, [profile]);

    useEffect(() => {
        if (ranksError) {
            addToast(cleanBackendMessage(ranksError), "error");
        }
    }, [ranksError, addToast]);

    const dataGame =
        game && ranksAll ? ranksAll[game] : { ranks: [], subranks: {} };

    const toogleEdit = () => {
        setIsEditing(!isEditing);
        setEditProfile(profile);
    };

    const handleSave = async () => {
        if (JSON.stringify(editProfile) === JSON.stringify(profile)) {
            addToast("Perfil sin cambios, no se guarda", "info");
            setIsEditing(false);
            return;
        }

        try {
            if (isNew) {
                const { _id, isNew, user, ...cleanProfile } = editProfile;
                await onSave(cleanProfile);
            } else {
                const response = await updateProfile(
                    editProfile._id,
                    editProfile
                );
                if (response?.success) {
                    addToast("Perfil actualizado", "success");
                    setIsEditing(false);
                    onSave();
                }
            }
        } catch (error) {
            console.error(error);
            addToast(cleanBackendMessage(error.message), "error");
        }
    };

    return (
        <div className="border-2 border-[var(--prim)] p-4 rounded-lg w-full">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-2 md:border-r-2 border-[var(--prim)] pr-8 min-w-1/3">
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={editProfile.user_game}
                                onChange={(e) =>
                                    setEditProfile({
                                        ...editProfile,
                                        user_game: e.target.value,
                                    })
                                }
                                className="text-2xl font-bold px-2 py-1 rounded-md text-white border-1 border-[var(--prim)]"
                            />
                            {isNew ? (
                                <select
                                    value={editProfile.game}
                                    onChange={(e) => {
                                        setGame(e.target.value);
                                        setEditProfile({
                                            ...editProfile,
                                            game: e.target.value,
                                        });
                                    }}
                                    className="text-2xl px-2 py-1 rounded-md text-white border-1 border-[var(--prim)]"
                                >
                                    <option
                                        value="Valorant"
                                        className="text-black"
                                    >
                                        Valorant
                                    </option>
                                    <option value="LoL" className="text-black">
                                        League of Legends
                                    </option>
                                    <option
                                        value="Fortnite"
                                        className="text-black"
                                    >
                                        Fortnite
                                    </option>
                                    <option
                                        value="Overwatch"
                                        className="text-black"
                                    >
                                        Overwatch 2
                                    </option>
                                </select>
                            ) : (
                                <p className="text-2xl">
                                    {normalizeGame(profile.game)}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold">
                                {profile.user_game}
                            </h2>
                            <p className="text-2xl">
                                {normalizeGame(profile.game)}
                            </p>
                        </>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-6 justify-between w-full">
                    <div className="flex flex-row gap-8">
                        <div>
                            <h3 className="text-lg font-bold">Rango</h3>
                            {isEditing ? (
                                <div>
                                    <select
                                        name="rank"
                                        className="w-full border-1 border-[var(--prim)] rounded-md"
                                        value={editProfile.rank}
                                        onChange={(e) =>
                                            setEditProfile({
                                                ...editProfile,
                                                rank: e.target.value,
                                                subrank: getSubranksFor(
                                                    e.target.value,
                                                    dataGame
                                                )[0],
                                            })
                                        }
                                    >
                                        {dataGame.ranks.map((rank) => (
                                            <option
                                                key={rank}
                                                value={rank}
                                                className="text-black"
                                            >
                                                {rank}
                                            </option>
                                        ))}
                                    </select>

                                    {hasSubranks(
                                        editProfile.rank,
                                        dataGame
                                    ) && (
                                        <select
                                            name="subrank"
                                            className="w-full mt-2 border-1 border-[var(--prim)] rounded-md"
                                            value={editProfile.subrank}
                                            onChange={(e) =>
                                                setEditProfile({
                                                    ...editProfile,
                                                    subrank: e.target.value,
                                                })
                                            }
                                        >
                                            {getSubranksFor(
                                                editProfile.rank,
                                                dataGame
                                            ).map((sub, index) => (
                                                <option
                                                    key={index}
                                                    value={sub}
                                                    className="text-black"
                                                >
                                                    {toRoman(Number(sub))}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            ) : (
                                <p className="text-lg">
                                    {profile.rank}
                                    {hasSubranks(profile.rank, dataGame) &&
                                        ` ${toRoman(Number(profile.subrank))}`}
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-bold">Estilo</h3>
                            {isEditing ? (
                                <select
                                    name="style"
                                    value={editProfile.style}
                                    onChange={(e) =>
                                        setEditProfile({
                                            ...editProfile,
                                            style: e.target.value,
                                        })
                                    }
                                    className="w-full text-white border-[var(--prim)] border-1 rounded-md"
                                >
                                    {styles.map((style) => (
                                        <option
                                            key={style}
                                            value={style}
                                            className="text-black"
                                        >
                                            {capitalize(style)}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-lg">
                                    {capitalize(profile.style)}
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-bold">Servidor</h3>
                            {isEditing ? (
                                <select
                                    name="server"
                                    value={editProfile.server}
                                    onChange={(e) =>
                                        setEditProfile({
                                            ...editProfile,
                                            server: e.target.value,
                                        })
                                    }
                                    className="w-full text-white border-[var(--prim)] border-1 rounded-md"
                                >
                                    {servers.map((server) => (
                                        <option
                                            key={server}
                                            value={server}
                                            className="text-black"
                                        >
                                            {server}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-lg">{profile.server}</p>
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="flex flex-row gap-4 items-center">
                            <button
                                onClick={handleSave}
                                className="btn bg-[var(--prim)] text-white px-6 h-12 rounded-lg hover:bg-[var(--prim-hover)] transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                            >
                                <i className="fa-regular fa-floppy-disk text-xl"></i>
                                Guardar
                            </button>
                            <button
                                onClick={toogleEdit}
                                className="btn border-2 border-red-500 text-red-500 px-6 h-12 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium"
                            >
                                <i className="fa-solid fa-xmark text-xl"></i>
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-row gap-4 items-center">
                            <button
                                onClick={toogleEdit}
                                className="btn bg-[var(--prim)] text-white px-6 h-12 rounded-lg hover:bg-[var(--prim-hover)] transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                            >
                                <i className="fa-regular fa-pen-to-square text-xl"></i>
                                Editar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn border-2 border-red-500 text-red-500 px-6 h-12 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium"
                            >
                                <i className="fa-regular fa-trash-can text-xl"></i>
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
