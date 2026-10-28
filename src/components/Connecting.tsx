import { API_URL } from "../config";
import axios from "axios"
import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../context/userContext";

const Connecting = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUser();
    return <>


        <div className="card-bakery auth-card">
            <label className="form-label" htmlFor="emailInput">אימייל </label>
            <input className="form-control" type="email" id="emailInput" placeholder="example@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            <br />
            <label className="form-label" htmlFor="passwordInput">סיסמה</label>
            <input className="form-control mb-4" type="password" id="passwordInput"
                value={password} onChange={(e) => setPassword(e.target.value)} />


            <button
                className="btn btn-brown w-100 py-2"
                disabled={loading}
                onClick={
                    async () => {
                        setLoading(true);
                        setError("");
                        console.log("on click")
                        try {
                            const response = await axios.post(`${API_URL}/api/auth/login`, { email: email, password: password });
                            // console.log(response.data.user.role);
                            // console.log(response.data.user);
                            localStorage.setItem("token", response.data.token);
                            setUser(response.data.user);
                            console.log("connected succsecfull!");
                            if (response.data.user.role == 'customer') {
                                navigate("/Order");
                            }
                            else {
                                navigate("/ManageAmount");
                            }


                        } catch (error) {
                            console.log(error);
                            setError("המשתמש אינו קיים במערכת, יש להרשם");
                        }
                        finally {
                            setLoading(false);
                        }
                    }
                }
            >התחברות</button>
            {error && <p className="alert alert-danger alert-bakery mt-3 mb-0">{error}</p>}
            {loading && <p className="status-text pb-0">...טוען</p>}
        </div >



    </>
}
export default Connecting
// post(`${API_URL}/api/auth/login`,
