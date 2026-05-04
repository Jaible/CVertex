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
        </nav>
    );
};

export default Navbar;