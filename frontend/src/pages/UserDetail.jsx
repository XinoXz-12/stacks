import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useFetch from "../hooks/useFetch";
import defaultAvatar from "../assets/default-avatar.png";

import {
    comparePassword,
    getImages,
    updateUser,
    updateUserImage,
    deleteProfile,
    createProfile,
    getUserById,
    getProfilesByUser,
} from "../services/stacks";
import {
    validateImage,
    normalizeGender,
    cleanBackendMessage,
} from "../helpers/normalizeFuctions";
import ProfileCard from "../components/ProfileCard";
import ConfirmModal from "../components/ConfirmModal";

const UserDetail = () => {
    const { addToast } = useToast();
    const navigate = useNavigate();

    // User
    const { id: urlId } = useParams();
    const { user, setUser, logout } = useAuth();
    const userId = urlId || user?.id;

    // Fetch user data
    const {
        data: userData,
        loading: loadingUser,
        error: errorUser,
    } = useFetch(() => getUserById(userId), [userId]);

    // Fetch profiles data
    const {
        data: profileData,
        loading: loadingProfiles,
        error: errorProfiles,
        refetch: reloadProfiles,
    } = useFetch(() => getProfilesByUser(userId), [userId]);

    // Form data
    const [formData, setFormData] = useState({
        username: "",
        age: "",
        gender: "",
        oldPassword: "",
        newPassword: "",
    });

    // Profiles
    const [profiles, setProfiles] = useState([]);
    const [creatingProfile, setCreatingProfile] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Update form data
    useEffect(() => {
        if (userData?.data) {
            setFormData((prev) => ({
                ...prev,
                username: userData.data.username || "",
                age: userData.data.age || "",
                gender: userData.data.gender || "",
                oldPassword: "",
                newPassword: "",
            }));
        }
    }, [userData]);

    // Update profiles
    useEffect(() => {
        if (profileData?.data) {
            setProfiles(profileData.data);
        }
    }, [profileData]);

    // Handle change form data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsLoading(true);
            try {
                const form = new FormData();
                form.append("image", file);
                const res = await updateUserImage(form);

                if (res.success) {
                    setUser((prev) => ({ ...prev, image: res.data.image }));
                    addToast("Imagen actualizada", "success");
                } else {
                    throw new Error(res.message || "Error al subir imagen");
                }
            } catch (error) {
                addToast(cleanBackendMessage(error.message), "error");
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle save
    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (formData.oldPassword || formData.newPassword) {
                if (!formData.oldPassword || !formData.newPassword) {
                    addToast("Completa ambas contraseñas", "error");
                    setIsLoading(false);
                    return;
                }

                const result = await comparePassword(formData.oldPassword);
                if (!result.data) {
                    addToast(cleanBackendMessage(result.message), "error");
                    setIsLoading(false);
                    return;
                }
            }

            const payload = {
                ...formData,
                age: parseInt(formData.age) || null,
            };

            if (!payload.newPassword) {
                delete payload.oldPassword;
                delete payload.newPassword;
            }

            const updated = await updateUser(userId, payload);
            if (!updated.success) {
                addToast(cleanBackendMessage(updated.message), "error");
                return;
            }

            setFormData((prev) => ({
                ...prev,
                username: updated.data.username || prev.username,
                age: updated.data.age || prev.age,
                gender: updated.data.gender || prev.gender,
                oldPassword: "",
                newPassword: "",
            }));

            addToast("Perfil actualizado", "success");
        } catch (error) {
            addToast(cleanBackendMessage(error.message), "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle create profile
    const handleCreateProfileClick = () => {
        setCreatingProfile({
            user_game: "",
            user_id: userId,
            game: "Valorant",
            rank: "Unranked",
            subrank: 1,
            style: "casual",
            server: "EU",
            user: userId,
            _id: "new-" + Date.now(),
            isNew: true,
        });
    };

    // Handle save new profile
    const handleSaveNewProfile = async (newProfileData) => {
        try {
            await createProfile(newProfileData);
            setCreatingProfile(null);
            reloadProfiles();
            addToast("Perfil creado", "success");
        } catch (error) {
            addToast(cleanBackendMessage(error.message), "error");
        }
    };

    // Handle delete profile
    const requestDeleteProfile = (profileId) => {
        setProfileToDelete(profileId);
        setShowDeleteConfirm(true);
    };

    // Handle confirm delete profile
    const confirmDeleteProfile = async () => {
        try {
            if (creatingProfile?._id === profileToDelete) {
                setCreatingProfile(null);
                return;
            }

            await deleteProfile(profileToDelete);
            reloadProfiles();
            addToast("Perfil eliminado", "success");
        } catch (error) {
            addToast(cleanBackendMessage(error.message), "error");
        } finally {
            setShowDeleteConfirm(false);
            setProfileToDelete(null);
        }
    };

    // Handle logout
    const handleLogout = () => {
        logout();
        addToast("¡Hasta luego!");
        navigate("/login");
    };

    return (
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
            {/* User info */}
            <div className="flex flex-col items-center gap-6 text-[var(--white)] p-6 rounded-lg w-full max-w-md mx-auto bg-[var(--sec)] m-4">
                <div className="relative">
                    <img
                        src={getImages(user?.image)}
                        alt={user?.username}
                        className={`w-32 h-32 object-cover img-user ${validateImage(
                            user?.image
                        )}`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultAvatar;
                        }}
                    />
                </div>

                {/* Image upload */}
                <div className="flex flex-col items-center gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={isLoading}
                    />
                    <label
                        htmlFor="image-upload"
                        className={`cursor-pointer px-4 py-2 rounded-md ${
                            isLoading
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-[var(--prim)] hover:bg-[var(--prim-hover)] text-white"
                        }`}
                    >
                        {isLoading ? "Subiendo..." : "Cambiar imagen"}
                    </label>
                </div>

                {/* Form */}
                <div className="w-full flex flex-col gap-4">
                    <label>
                        <span className="block mb-1">Username</span>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md bg-[var(--sec)] text-[var(--white)] border border-[var(--prim)] focus:bg-[var(--bg)]"
                        />
                    </label>

                    <label>
                        <span className="block mb-1">Email</span>
                        <input
                            type="email"
                            value={user?.email}
                            disabled
                            className="w-full px-3 py-2 rounded-md bg-gray-600 text-gray-300 cursor-not-allowed focus:bg-[var(--bg)]"
                        />
                    </label>

                    <label>
                        <span className="block mb-1">Edad</span>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            min="0"
                            max="120"
                            className="w-full px-3 py-2 rounded-md bg-[var(--sec)] text-[var(--white)] border border-[var(--prim)] focus:bg-[var(--bg)]"
                        />
                    </label>

                    <label>
                        <span className="block mb-1">Género</span>
                        <input
                            type="text"
                            name="gender"
                            value={normalizeGender(user?.gender)}
                            disabled
                            className="w-full px-3 py-2 rounded-md bg-gray-600 text-gray-300 cursor-not-allowed"
                        />
                    </label>

                    <label>
                        <span className="block mb-1">Contraseña actual</span>
                        <input
                            type="password"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md bg-[var(--sec)] text-[var(--white)] border border-[var(--prim)] focus:bg-[var(--bg)]"
                        />
                    </label>

                    <label>
                        <span className="block mb-1">Nueva contraseña</span>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md bg-[var(--sec)] text-[var(--white)] border border-[var(--prim)] focus:bg-[var(--bg)]"
                        />
                    </label>

                    {/* Save button */}
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className={`mt-4 px-4 py-2 rounded-md font-semibold ${
                            isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[var(--prim)] hover:bg-[var(--prim-hover)] text-white"
                        }`}
                    >
                        {isLoading ? "Guardando..." : "Guardar cambios"}
                    </button>

                    {/* Logout button */}
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="border-2 border-red-500 text-red-500 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium justify-center btn"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Profiles */}
            <div className="flex flex-col items-center gap-6 text-[var(--white)] p-6 rounded-lg w-full md:col-span-2 mx-auto bg-[var(--sec)] m-4">
                <h1 className="text-3xl font-bold">Mis Perfiles</h1>
                <div className="flex flex-col items-center gap-4 w-full">
                    {/* Profiles cards */}
                    {profiles.length > 0 ? (
                        profiles.map((profile) => (
                            <ProfileCard
                                key={profile._id}
                                profile={profile}
                                handleDelete={() =>
                                    requestDeleteProfile(profile._id)
                                }
                                onSave={reloadProfiles}
                            />
                        ))
                    ) : (
                        <p className="text-center text-white/70 mt-6 italic">
                            No se encontraron perfiles.
                        </p>
                    )}

                    {/* New profile card */}
                    {creatingProfile && (
                        <ProfileCard
                            key={creatingProfile._id}
                            profile={creatingProfile}
                            isNew={true}
                            isEditing={true}
                            onSave={handleSaveNewProfile}
                            handleDelete={() => setCreatingProfile(null)}
                            onCancel={() => setCreatingProfile(null)}
                        />
                    )}
                </div>

                {/* Create profile button */}
                <button
                    onClick={handleCreateProfileClick}
                    className="btn bg-[var(--prim)] hover:bg-[var(--prim-hover)] text-white px-4 py-2 rounded-md"
                >
                    Crear Perfil
                </button>
            </div>

            {/* Confirmations modals */}
            <ConfirmModal
                show={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteProfile}
                title="¿Eliminar perfil?"
                description="Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
            />
            <ConfirmModal
                show={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="¿Cerrar sesión?"
                description="Perderás el acceso hasta volver a iniciar sesión."
                confirmText="Cerrar sesión"
                cancelText="Cancelar"
                type="warning"
            />
        </div>
    );
};

export default UserDetail;
