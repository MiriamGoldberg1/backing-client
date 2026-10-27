import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type Customer from "../models/customer";
import Header from "./Header";
//GET /api/admin/customers


async function getAllCustomersForMannager(): Promise<Customer[]> {

    const token = localStorage.getItem("token");


    const allCustomers = await axios.get<Customer[]>(
        "http://localhost:5000/api/admin/customers", {
        headers: { Authorization: `Bearer ${token}` }
    }

    );
    console.log("getAllCustomersForMannager");


    return allCustomers.data;
}


// הקומפוננטה שמציגה את הלקוחות
///api/admin/customers ๮ פרטי כל הלקוחות
const ShowAllCustomersForMannager = () => {

    const { data: customers, isLoading, isError } = useQuery({
        queryKey: ["customers"],
        queryFn: getAllCustomersForMannager,
    });

    if (isLoading) return <p className="status-text">...טוען</p>;
    if (isError) return <p className="alert alert-danger alert-bakery mt-5">שגיאה בטעינת הלקוחות</p>;

    return <>
        <Header />
        <p className="page-title">כל הלקוחות</p>
        <ul className="customer-list">
            {customers?.map((c) => (
                <li className="customer-item" key={c.id}>{c.fullName} | {c.email} | {c.address}</li>
            ))}
        </ul> </>
}
export default ShowAllCustomersForMannager;