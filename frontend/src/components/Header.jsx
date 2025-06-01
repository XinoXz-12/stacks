import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getImages } from "../services/stacks";
import { validateImage } from "../helpers/normalizeFuctions";
import defaultAvatar from "../assets/images/jidenticon-default-avatar.png";

const Header = () => {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    // Redirect to login if user is not logged in
    useEffect(() => {
        if (user && !user.id) {
            navigate("/login");
        }
    }, [user, navigate]);

    // Close menu if mobile
    useEffect(() => {
        if (!menuOpen) {
            const timeout = setTimeout(() => setMenuOpen(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [menuOpen]);

    // Close menu if mobile
    const closeMenuIfMobile = () => {
        if (window.innerWidth < 768) {
            setMenuOpen(false);
        }
    };

    // Nav links to central nav
    const navLinks = [
        !user && { to: "/", label: "Inicio" },
        { to: "/teams", label: "Stacks" },
        { to: "/news", label: "Noticias" },
        user?.id && { to: "/chat", label: "Chat" },
        { to: "/faq", label: "FAQ" },
        menuOpen && !user && { to: "/login", label: "Únete a Stacks" },
    ].filter(Boolean);

    return (
        <header className="bg-[var(--sec)] top-0 z-100 shadow-lg py-4">
            <div className="mx-4 px-4">
                <nav className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo */}
                    <NavLink
                        to={!user ? "/" : "/teams"}
                        className="logo text-[var(--white)] font-bold text-xl"
                        onClick={closeMenuIfMobile}
                    ></NavLink>

                    {/* Central nav */}
                    <ul
                        className={`${
                            menuOpen ? "dropdown-in mt-4" : "dropdown-out"
                        } absolute md:static top-20 left-0 w-full md:w-auto bg-[var(--sec)] md:bg-transparent px-6 py-4 md:p-0 space-y-4 md:space-y-0 md:space-x-10 md:flex text-lg font-bold text-white transition-all duration-300 ease-in-out transform`}
                    >
                        {navLinks.map(({ to, label }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    className="text-hover"
                                    onClick={closeMenuIfMobile}
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Session and extras */}
                    <div className="flex items-center gap-6">
                        {user?.id ? (
                            <>
                                <NavLink
                                    to="/my-teams"
                                    className="text-hover"
                                    title="Mis Stacks"
                                    onClick={closeMenuIfMobile}
                                >
                                    Mis Stacks
                                </NavLink>
                                <NavLink
                                    to={`/user/${user.id}`}
                                    className="text-hover flex flex-col items-center"
                                    title="Perfil"
                                    onClick={closeMenuIfMobile}
                                >
                                    <img
                                        src={getImages(user.image)}
                                        alt={user.username}
                                        className={`w-10 h-10 object-cover img-user ${validateImage(
                                            user.image
                                        )}`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = defaultAvatar;
                                        }}
                                    />
                                    {user.username}
                                </NavLink>
                            </>
                        ) : (
                            <div className="gap-2 hidden md:flex">
                                <NavLink
                                    to="/login"
                                    className="btn btn-action ml-4 relative px-4 py-2 rounded-sm border-2 border-[var(--prim)] text-lg"
                                >
                                    Únete a Stacks
                                </NavLink>
                            </div>
                        )}

                        {/* Burger */}
                        <button
                            className="md:hidden text-white text-2xl"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <i
                                className={`fas ${
                                    menuOpen ? "fa-xmark" : "fa-bars"
                                }`}
                            />
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
