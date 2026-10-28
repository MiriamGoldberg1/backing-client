import { API_URL } from "../config";
//בזמן לחיצה על כפתור "נהל מוצר זה" של מוצר מסוים, המנהל ינווט לפה
//עם הID של המוצר וככה נשנה את 
// מחיר או כמות במלאי של מוצר זה
import axios from "axios";
import { useNavigate, useParams } from "react-router";

import type Product from "../models/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

//שליפת טוקן מ localStorage
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

// שליפת מוצר אחד by id
async function getProductById(id: string): Promise<Product> {
    const response = await axios.get<Product>(
        `${API_URL}/api/products/${id}`,
        { headers: auth() }
    );
    return response.data;
}


//עדכון כמות למוצר זה
async function ChangeAmount(id: string, amount: number) {
    const response = await axios.patch(
        `${API_URL}/api/products/${id}/stock`,
        { stock: amount },
        { headers: auth() }
    );
    return response.data;
}

//עדכון מחיר למוצר זה - העלאה או הפחתה בסכום (₪)
async function ChangePrice(id: string, direction: "increase" | "decrease", amount: number) {
    const response = await axios.patch(
        `${API_URL}/api/products/${id}/price/${direction}`,
        { amount },
        { headers: auth() }
    );
    return response.data;
}



// const MannageThisItem = () => {
//     //שליפת מידע על המוצר  //GET /api/products/:id
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();
//     const [newStock, setNewStock] = useState("");


//     const product = await axios.get<>()



//     const { id } = useParams();
//     return <>
//         <h3>עמוד ניהול מוצר {id}</h3>
//     </>
// }
// export default MannageThisItem;


const MannageThisItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [newStock, setNewStock] = useState("");
    const [priceChange, setPriceChange] = useState("");

    const { data: product, isPending, isError, error } = useQuery<Product, Error>({
        queryKey: ["product", id],
        queryFn: () => getProductById(id!),
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: () => ChangeAmount(id!, Number(newStock)),
        onSuccess: () => {
            alert("הכמות עודכנה בהצלחה");
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
            navigate("/ManageAmount");
        },
    });

    const priceMutation = useMutation({
        mutationFn: (direction: "increase" | "decrease") => ChangePrice(id!, direction, Number(priceChange)),
        onSuccess: () => {
            alert("המחיר עודכן בהצלחה");
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
            navigate("/ManageAmount");
        },
    });

    if (isPending) return <p className="status-text">טוען...</p>;
    if (isError) return <p className="alert alert-danger alert-bakery mt-5">שגיאה: {error.message}</p>;

    return (

        <main className="card-bakery item-card my-5" dir="rtl">

            <h3 className="item-label"> ניהול מוצר {id}</h3>

            <h1 className="page-title mt-2">{product.name}</h1>
            <p className="item-detail">חברה: {product.company}</p>
            <p className="item-detail">כמות נוכחית במלאי: {product.stock}</p>
            <p className="item-detail">  מחיר: {product.price} ₪</p>

            <input
                className="form-control mt-4 mb-3 text-center"
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                placeholder="כמות חדשה"
            />
            <button className="btn btn-brown w-100 py-2" onClick={() => mutation.mutate()} disabled={newStock === "" || mutation.isPending}>
                {mutation.isPending ? "שומר..." : "עדכון כמות"}
            </button>

            {mutation.isError && <p className="mt-3 mb-0" style={{ color: "crimson" }}>העדכון נכשל</p>}

            <input
                className="form-control mt-4 mb-3 text-center"
                type="number"
                min="0"
                step="0.01"
                value={priceChange}
                onChange={(e) => setPriceChange(e.target.value)}
                placeholder="סכום שינוי מחיר (₪)"
            />
            <div className="d-flex gap-2">
                <button className="btn btn-brown w-50 py-2" onClick={() => priceMutation.mutate("increase")} disabled={Number(priceChange) <= 0 || priceMutation.isPending}>
                    {priceMutation.isPending ? "שומר..." : "העלאת מחיר"}
                </button>
                <button className="btn btn-brown w-50 py-2" onClick={() => priceMutation.mutate("decrease")} disabled={Number(priceChange) <= 0 || priceMutation.isPending}>
                    {priceMutation.isPending ? "שומר..." : "הפחתת מחיר"}
                </button>
            </div>

            {priceMutation.isError && <p className="mt-3 mb-0" style={{ color: "crimson" }}>עדכון המחיר נכשל</p>}
        </main>
    );
};

export default MannageThisItem;