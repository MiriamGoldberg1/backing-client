
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import Header from "../components/Header";
import { useNavigate } from "react-router";
import type Product from "../models/product";

//  פונקציה לשליפת המלאי מהשרת
async function getAllProducts(): Promise<Product[]> {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("  יש להתחבר מחדש.");
    }
    const response = await axios.get<{ products: Product[] }>(
        "http://localhost:5000/api/admin/inventory", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    );
    // console.log(response.data.products);
    return response.data.products;
}


const ManageAmount = () => {

    const navigate = useNavigate();

    const {
        data,
        isPending,
        isError,
        error,
    } = useQuery<Product[], Error>({
        queryKey: ["inventory"],
        queryFn: getAllProducts,
    });

    // נטען 
    if (isPending) {
        return (
            <>
                <Header />
                <p className="status-text">טוען נתוני מלאי...</p>
            </>
        );
    }


    if (isError) {
        return (
            <>
                <Header />
                <p className="alert alert-danger alert-bakery my-5">שגיאה בטעינת המלאי: {error.message}</p>
            </>
        );
    }

    // הצגת הנתונים
    return (
        <>
            <Header />

            <main className="container manage-page pb-5">
                <div className="manage-header">
                    <h1 className="page-title">ניהול מלאי</h1>
                    <button className="btn btn-brown add-product-btn" onClick={() => navigate("/AddProduct")}>
                        + הוסף מוצר למלאי
                    </button>
                </div>

                <table className="table table-striped table-hover table-bakery align-middle text-center">
                    <thead>
                        <tr>
                            <th>מזהה</th>
                            <th>שם המוצר</th>
                            <th>חברה</th>
                            <th>כמות במלאי</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.company}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button
                                        className="btn btn-brown btn-sm"
                                        onClick={() => {
                                            console.log("נהל מוצר זהon click now");
                                            navigate(`/MannageThisItem/${product.id}`)
                                        }}
                                    >נהל מוצר זה</button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

        </>
    );
}

export default ManageAmount;
