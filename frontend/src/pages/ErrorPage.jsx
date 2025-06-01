import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ErrorPage = () => {
    const error = useRouteError();
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] w-full">
            <div className="text-center">
                <img
                    src="/stacks_dark.png"
                    alt="logo"
                    className="w-30 h-30 mx-auto mb-8"
                />
                <h1 className="mb-4 text-4xl font-bold text-[var(--white)]">
                    ¡Oh, no!
                </h1>
                <p className="mb-8 text-xl text-[var(--white)]">
                    {error?.statusText || error?.message || "Algo salió mal"}
                </p>
                <Link
                    to={user ? "/teams" : "/"}
                    className="btn btn-action ml-4 relative px-4 py-2 rounded-sm border-2 border-[var(--prim)] text-lg"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
