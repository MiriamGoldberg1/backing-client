import { Link } from "react-router"

// import {About  } from "../pages/About";
const Footer = () => {
    return <footer className="site-footer order-last">

        <nav className="d-flex justify-content-center flex-wrap gap-4">
            <Link className="footer-link" to="/About">אודותינו</Link>
            <Link className="footer-link" to="/Policy">מדיניות החברה</Link>

        </nav>
    </footer>
}
export default Footer

