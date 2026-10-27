// בדף זה לעשות בדיקה האם המחובר הור מנהל\לקוח
// ולפי זה לעשות את הקריאת שרת המתאימה
// אין צורך בעוד 2 קומפוננטות נפרדות

import { Fragment, useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import axios from "axios";
import type { Order } from "../models/order";
import Header from "../components/Header";




async function managerHistory() {

    const token = localStorage.getItem("token");
    const res = await axios.get<Order[]>("http://localhost:5000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` }
    }

    )

    console.log("I am in managerHistory");

    return res.data;
}

async function customerHistory() {

    const token = localStorage.getItem("token");

    const res = await axios.get<Order[]>("http://localhost:5000/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` }
    }
    )

    return res.data;
}

const History = () => {

    const { user, isAdmin, loading } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);

    const [orderID, setorderID] = useState<number | null>(null);


    useEffect(() => {
        if (loading || !user) return;

        const fetchHistory = isAdmin ? managerHistory : customerHistory;
        fetchHistory()
            .then(data => setOrders(data))
            .catch(err => console.error(err));
    }, [user, isAdmin, loading]);

    return <>
        <Header />
        <h2 className="page-title">היסטורית ההזמנות</h2>

        {(loading) && <p className="status-text">...טוען</p>}



        {/* <p className="status-chip">סטטוס: {isAdmin ? "מנהל" : "לקוח"}</p> */}

        {!loading && orders.length === 0 && <p className="status-text">אין הזמנות עדיין</p>}

        {orders.map(order => (
            <Fragment key={order.id}>
                <div className="history-item">
                    {isAdmin && ` שם הלקוח: ${order.customer?.fullName} `}
                    <div> תאריך הזמנה: {new Date(order.createdAt).toLocaleDateString()}</div>
                    <div> סכום כולל: {order.total} ש"ח</div>
                    <button className="arrow-btn" onClick={() => setorderID(order.id)} aria-label="פתיחת פרטי ההזמנה">⌄</button>
                </div>

                {orderID === order.id && (
                    <div className="order-details">
                        <button className="arrow-btn" onClick={() => setorderID(null)} aria-label="סגירת פרטי ההזמנה">⌃</button>

                        {isAdmin && order.customer && <>
                            <div>לקוח: {order.customer.fullName}</div>
                            <div>אימייל: {order.customer.email}</div>
                            <div>טלפון: {order.customer.phone}</div>
                        </>}
                        <div>תאריך: {new Date(order.createdAt).toLocaleString()}</div>
                        <div>כתובת משלוח: {order.deliveryAddress ?? "לא צוינה"}</div>
                        {order.notes && <div>הערות: {order.notes}</div>}
                        <div>מספר פריטים: {order.itemsCount}</div>

                        {order.items.map(i => (
                            <div className="order-line" key={i.productId}>
                                {i.productName} ({i.company}) · {i.productQuantity.amount} {i.productQuantity.unitLabel}
                                {" · "}{i.quantity} × {i.unitPrice} ש"ח = {i.lineTotal} ש"ח
                            </div>
                        ))}

                        <div><strong>סה"כ: {order.total} ש"ח</strong></div>
                    </div>
                )}
            </Fragment>
        ))}
    </>
}
export default History;
