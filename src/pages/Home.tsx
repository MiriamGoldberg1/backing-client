import { useUser } from "../context/userContext"
import Connecting from "../components/Connecting";
import { useNavigate } from "react-router";
import Logout from "../components/Logout";

const Home = () => {

    const navigate = useNavigate()

    const { user } = useUser();
    return (
        <>
            {/* בדף הבית ה header מכיל רק כפתור התנתקות */}
            {user && (
                <nav className="site-header">
                    <Logout />
                </nav>
            )}

            {user ? <h5 className="welcome-banner">ברוכים הבאים, {user.fullName}</h5> : <h5 className="welcome-banner">חדשים במערכת? שמחים שהצטרפתם אלינו! לחצו על <button className="btn btn-link-brown" onClick={
                () => {
                    navigate("/Login")
                }
            }>הרשמה</button> והרשמו למערכת באופן קל ופשוט</h5>}
            <Connecting />

        </>
    )
}
export default Home;