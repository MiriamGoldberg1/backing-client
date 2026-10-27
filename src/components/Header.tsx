import Logout from "./Logout"
import { useNavigate } from "react-router";
import { useUser } from "../context/userContext";
const Header = () => {
    const { user, isAdmin } = useUser();
    const navigate = useNavigate();
    return (


        <>


            <nav className="site-header">
                {/* כפתור התנתקות גם למנהל וגם ללקוח */}
                {user && (
                    <>
                        <Logout />
                        <div className="brand-logo" onClick={() => {
                            if (isAdmin) {
                                navigate("/ManageAmount")
                            }

                            if (user && !isAdmin) {
                                navigate("/Order")
                            }
                        }}></div>
                    </>
                )}

                {/* כפתורים למנהל בלבד */}
                {isAdmin && (
                    <>
                        <button className="btn btn-nav" onClick={() => navigate("/ShowAllCustomersForMannager")}>הצג פרטי הלקוחות
                        </button>

                        <button className="btn btn-nav" onClick={() => navigate("/History")}
                        >הסטורית ההזמנות</button>
                    </>
                )}

                {/* כפתורי לקוח */}
                {
                    user && !isAdmin && (
                        <button className="btn btn-nav" onClick={() => navigate("/History")
                        }>היסטורית ההזמנות שלי</button>
                    )
                }


            </nav>
        </>

    );
}
export default Header
