import { useEffect, useState } from "react";
import Header from "../components/Header"
import axios from "axios";
import type Product from "../models/product";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addItem, decreaseItem } from "../models/cartSlice";
import type { RootState } from "../store";
import { unitOptions } from "../schemas/addProductSchema";




const Order = () => {

    const baseAPI = "http://localhost:5000/api/products?category="
    const categories = [
        { key: "all", label: "הצג הכל", url: `http://localhost:5000/api/products` },
        { key: "creams", label: "קרמים ומליות", url: `${baseAPI}creams_fillings` },
        { key: "doughs", label: "בצקים ובסיסים מוכנים", url: `${baseAPI}doughs_bases` },
        { key: "chocolates", label: "שוקולדים", url: `${baseAPI}chocolates` },
        { key: "decorations", label: "קישוטי עוגה", url: `${baseAPI}cake_decorations` },
        { key: "flavors", label: "תמציות טעם ואבקות", url: `${baseAPI}extracts_powders` },
        { key: "colors", label: "צבעי מאכל", url: `${baseAPI}food_colors` },
        { key: "misc", label: "שונות", url: `${baseAPI}misc` },
    ];


    const [selectedCategory, setSelectedCategory] = useState("all");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState<string>("");

    const dispatch = useDispatch();
    const cartItems = useSelector((s: RootState) => s.cart.items);

    //מה יקרה כל פעם שהקטגוריה תשתנה==המשתמש יבחר קטגוריה אחרת
    useEffect(
        () => {
            //שומר את כל האוביקט של הקטגוריה שנבחרה 
            const currentCategory = categories.find((c) => c.key == selectedCategory)
            if (!currentCategory) return;

            const controller = new AbortController(); //נועד לעצירת קריאה אם נשלחת אחריה קריאה נוספת

            setLoading(true);
            setError(null);


            axios
                .get<Product[]>(currentCategory.url, { signal: controller.signal })
                .then((res) => setProducts(res.data))
                .catch((err: unknown) => {
                    if (axios.isCancel(err)) return;
                    // אם אין response - השרת לא ענה בכלל
                    const status = axios.isAxiosError(err) ? err.response?.status : undefined;
                    switch (status) {
                        case 400:
                            console.error("400 - בקשה שגויה", err);
                            break;
                        case 401:
                            console.error("401 - לא מורשה", err);
                            
                            break;
                        case 404:
                            console.error("404 - לא נמצא", err);
                            break;
                        case 500:
                            console.error("500 - שגיאת שרת", err);
                            break;
                        case undefined:
                            console.error("השרת לא ענה", err);
                            break;
                        default:
                            console.error(`שגיאה ${status}`, err);
                    }
                    // הודעה למשתמש בכל סוג של שגיאה
                    setError("שגיאה בטעינת המוצרים");
                })
                .finally(() => setLoading(false));

            // ביטול הקריאה הקודמת אם נבחרה קטגוריה אחרת
            return () => controller.abort();
        }, [selectedCategory]);

    const handleSelect = (key: string): void => {
        setSelectedCategory(key);
    };


    useEffect(() => {

    }, [search])

    const searchResults = products.filter((f) => f.name.includes(search.trim()));

    //אם המוצר כבר בעגלה - מציגים כמה הוזמנו עם + ו -, אחרת כפתור הוספה
    const renderProduct = (p: Product) => {
        const qty = cartItems.find((i) => i.id === p.id)?.qty ?? 0;
        return (
            <li className="product-card" key={p.id}>
                {p.name} - {p.company} ({p.quantity?.amount} {unitOptions.find((u) => u.key === p.quantity.unit)?.label ?? p.quantity.unit})
                {qty === 0 ? (
                    <button className="btn btn-brown btn-sm" onClick={() => dispatch(addItem(p))}>הוסף לעגלה</button>
                ) : (
                    <div className="qty-control">
                        <button className="btn btn-brown btn-sm" onClick={() => dispatch(addItem(p))}>+</button>
                        <span>הוזמנו {qty} פריטים</span>
                        <button className="btn btn-brown btn-sm" onClick={() => dispatch(decreaseItem(p.id))}>-</button>
                    </div>
                )}
            </li>
        );
    };

    return (<>



        <Link to="/MyCart" className="btn btn-brown cart-fab" >העגלה שלי</Link>
        <Header />

        <p className="page-title order-1">החנות הוירטואלית שלנו</p>
        {search === "" && (
            <div className="catalog order-3">
                <select
                    className="form-select category-select"
                    value={selectedCategory}
                    onChange={(e) => handleSelect(e.target.value)}
                >
                    {categories.map((c) => (
                        <option key={c.key} value={c.key}>
                            {c.label}
                        </option>
                    ))}
                </select>

                {loading && <p className="status-text">טוען...</p>}
                {error && <p className="alert alert-danger alert-bakery">{error}</p>}
                {!loading && !error && (
                    <ul className="product-grid">
                        {products.map(renderProduct)}
                    </ul>
                )}
            </div>
        )}


        <input className="form-control search-input order-2" type="text" value={search} placeholder="חיפוש" onChange={(e) => setSearch(e.target.value)} />

        {search !== "" && (
            <ul className="product-grid results order-3">
                {searchResults.length === 0 && <li className="empty-message">לא נמצאו מוצרים</li>}
                {searchResults.map(renderProduct)}
            </ul>
        )}

    </>)
}
export default Order

