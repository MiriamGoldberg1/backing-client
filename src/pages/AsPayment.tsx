import { API_URL } from "../config";
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import type { RootState } from '../store';
import { clearCart, removeItem, setQty } from '../models/cartSlice';

const AsPayment = () => {

    const nav = useNavigate()
    const dispatch = useDispatch();
    const items = useSelector((s: RootState) => s.cart.items);
    const sumPrice = useLocation().state?.sumPrice ?? 0;

    // שליחת ההזמנה לשרת - המחיר מחושב בשרת, שולחים רק מזהה מוצר וכמות
    async function confirmPayment() {
        const token = localStorage.getItem("token");
        try {
            await axios.post(`${API_URL}/api/orders`,
                { items: items.map(i => ({ productId: i.id, quantity: i.qty })) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            dispatch(clearCart());
            alert("הזמנה עברה בהצלחה")
            nav("/");
        } catch (err: any) {
            const message: string | undefined = err.response?.data?.message;
            console.error(message);
            if (err.response?.status === 409 && message) {
                fixStock(message);
                alert(`${message}\nיתכנו שינויים בכמות הפריטים שהזנתם ממוצר זה, או שהוא ימחק לגמרי מן ההזמנה`);
            }
            else alert(message || "ההזמנה נכשלה");
            if (err.response?.status === 400) nav("/MyCart");
        }
    }

    // 409 - אין מספיק במלאי. השרת מחזיר רק את שם המוצר בהודעה, לכן מזהים את המוצר בעגלה לפי השם
    function fixStock(message: string) {
        const name = message.match(/"(.+)"/)?.[1];
        const item = items.find(i => i.name === name);
        if (!item) return;
        const left = message.match(/נותרו במלאי (\d+)/)?.[1];
        if (left) dispatch(setQty({ id: item.id, qty: Number(left) }));
        else dispatch(removeItem(item.id));
    }

    return (
        <>
            <h2 className="payment-notice">הבהרה חשובה: אתר זה הינו אתר דמה בלבד ועל כן פרטי התשלום אינם מופיעים בו, בכדי שלא יועברו לאף גורם.
           <br />עמוד זה מדמה עמוד אישור התשלום לאחר הזנת פרטי אשראי בעמוד חיצוני
            </h2>
            <div className="payment-total">סך לתשלום:{sumPrice} ש"ח</div>
            <button className="btn btn-brown payment-confirm" onClick={confirmPayment}>אישור התשלום</button>


        </>
    )
}
export default AsPayment;
