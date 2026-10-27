import { useNavigate } from "react-router";
import { useUser } from "../context/userContext";


const Logout = () => {

    const navigate = useNavigate()
    const { user, setUser } = useUser();

    return (
        <>

            <button className="btn btn-logout" onClick={() => {
                localStorage.removeItem("token");
                if (user) localStorage.removeItem(`cart_${user.id}`);
                setUser(null);
                navigate("/");
            }
            }
            >התנתקות</button >


        </>
    )
}
export default Logout;