import {Link, useLocation, useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";

const Navbar = () => {
    const { auth } = usePuterStore();
    const navigate = useNavigate();
    const location = useLocation();

    const next =
        new URLSearchParams(location.search).get("next") || "/";

    return (
        <nav className="navbar" role="navigation">
            <Link to="/" className="shrink-0">
                <p className="text-2xl font-bold text-gradient">CVertex</p>
            </Link>

            <Link
                to="/upload"
                className="primary-button w-fit inline-flex items-center justify-center"
            >
                Upload Resume
            </Link>
            <button
                className="
                            bg-red-500/15 hover:bg-red-500/25
                            border border-red-500/20
                            text-red-300
                            px-5 py-3
                            rounded-2xl
                            backdrop-blur-md
                            transition-all duration-200
                            cursor-pointer
                            font-semibold
                            disabled:opacity-50
                            disabled:pointer-events-none"
                onClick={auth.signOut}
            >
                <p>Log Out</p>
            </button>
        </nav>
    );
};

export default Navbar;