import { Link } from "react-router";

const Navbar = () => {
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