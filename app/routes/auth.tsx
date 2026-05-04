import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { usePuterStore } from "~/lib/puter";

export const meta = () => [
    { title: "CVertex | Auth" },
    {
        name: "description",
        content: "Log in into your account",
    },
];

const Auth = () => {
    const { isLoading, auth } = usePuterStore();

    const location = useLocation();
    const navigate = useNavigate();

    const next =
        new URLSearchParams(location.search).get("next") || "/";

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next, { replace: true });
        }
    }, [auth.isAuthenticated, navigate, next]);

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover bg-center min-h-screen flex items-center justify-center p-6">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-black/30 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl p-10 transition-all duration-300 shadow-[0_0_50px_rgba(139,184,255,0.05)]">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <h1 className="text-4xl font-bold text-zinc-100">
                            Welcome
                        </h1>

                        <h2 className="text-zinc-400 text-lg leading-relaxed">
                            Log in to continue your job journey
                        </h2>
                    </div>

                    {isLoading ? (
                        <button
                            disabled
                            className="auth-button animate-pulse cursor-not-allowed opacity-80"
                        >
                            <p>Signing you in...</p>
                        </button>
                    ) : auth.isAuthenticated ? (
                        <button
                            className="auth-button"
                            onClick={auth.signOut}
                        >
                            <p>Log Out</p>
                        </button>
                    ) : (
                        <button
                            className="auth-button"
                            onClick={auth.signIn}
                        >
                            <p>Log In</p>
                        </button>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Auth;