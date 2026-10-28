import { API_URL } from "../config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type LoginFormData, loginFormSchema } from "../schemas/loginFormSchema"
import axios from "axios";
import { useNavigate } from "react-router";
import { useUser } from "../context/userContext";


const Login = () => {

    const navigate = useNavigate();
    const { setUser } = useUser();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>(
        {
            resolver: zodResolver(loginFormSchema),
            mode: "onChange",
            defaultValues: {
                fullName: "",
                email: "",
                phone: "",
                address: "",
                password: "",
                confirmPassword: "",
                note: ""
            },
        }
    );

    // הפונקציה מופעלת רק אם כל הנתונים עברו את האימות בהצלחה
    const onSumbit = async (data: LoginFormData) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, {
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                phone: data.phone,
                address: `${data.address}`,
                notes: data.note,
            });
            localStorage.setItem("token", res.data.token);   // הלקוח מחובר מיד
            setUser(res.data.user);
            reset();

            navigate("/Order");
        }
        catch (error: any) {
            alert(error.response?.data?.message || "ההרשמה נכשלה");
        }
    }



    return (
        <form className="card-bakery form-card my-5" onSubmit={handleSubmit(onSumbit, (errs) => console.log("שגיאה:  :", errs))} noValidate>


            <h2 className="page-title mt-0">טופס הרשמה</h2>

            {/* שדה שם משתמש */}
            <div className="mb-2">
                <label className="form-label" htmlFor="userName">שם משתמש</label>
                <input
                    className="form-control"
                    id="userName"
                    {...register("fullName")}
                    placeholder="ישראל ישראלי"
                />
                {/* הצגת הודעת השגיאה של השדה, אם קיימת */}
                <p className="field-error">{errors.fullName?.message}</p>
            </div>

            {/* שדה כתובת אימייל */}
            <div className="mb-2">
                <label className="form-label" htmlFor="email">כתובת אימייל</label>
                <input
                    className="form-control"
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="example@example.com"
                />
                <p className="field-error">{errors.email?.message}</p>
            </div>


            <div className="mb-2">
                <label className="form-label" htmlFor="telephone">טלפון</label>
                <input
                    className="form-control"
                    id="telephone"
                    type="tel"
                    {...register("phone")}
                />
                <p className="field-error">{errors.phone?.message}</p>
            </div>


            <div className="mb-2">
                <label className="form-label" htmlFor="address">address</label>
                <input
                    className="form-control"
                    id="address"
                    {...register("address")}
                />
                <p className="field-error">{errors.address?.message}</p>
            </div>
            <div className="mb-2">
                <label className="form-label" htmlFor="password">סיסמה</label>
                <input
                    className="form-control"
                    id="password"
                    type="password"
                    {...register("password")}
                />
                <p className="field-error">{errors.password?.message}</p>
            </div>

            <div className="mb-2">
                <label className="form-label" htmlFor="confirmPassword">אימות הסיסמה</label>
                <input
                    className="form-control"
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                />
                <p className="field-error">{errors.confirmPassword?.message}</p>
            </div>

            <div className="mb-2">
                <label className="form-label" htmlFor="note">?יש לכם משהוא נוסף שחשוב שנדע</label>
                <textarea
                    className="form-control"
                    id="note"
                    {...register("note")}
                    placeholder="הערות נוספות"
                />
                <p className="field-error">{errors.note?.message}</p>
            </div>

            <button className="btn btn-brown w-100 py-2 mt-3" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "שולח נתונים..." : "שליחה"}
            </button>
        </form>
    )



}
export default Login;