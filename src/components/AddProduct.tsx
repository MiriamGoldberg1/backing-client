import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import Header from "./Header"
import {
    type AddProductFormData,
    addProductSchema,
    categoryOptions,
    storageOptions,
    unitOptions,
} from "../schemas/addProductSchema";

const AddProduct = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddProductFormData>(
        {
            resolver: zodResolver(addProductSchema),
            mode: "onChange",
            defaultValues: {
                name: "",
                company: "",
                stock: 0,
                description: "",
                imageUrl: "",
            },
        }
    );

    // הפונקציה מופעלת רק אם כל הנתונים עברו את האימות בהצלחה
    const onSubmit = async (data: AddProductFormData) => {
        try {
            await axios.post("http://localhost:5000/api/products", {
                name: data.name,
                company: data.company,
                category: data.category,
                quantity: { amount: data.quantity.amount, unit: data.quantity.unit },
                storage: data.storage,
                price: data.price,
                stock: data.stock,
                // שדות רשות - לא שולחים מחרוזת ריקה
                description: data.description || undefined,
                imageUrl: data.imageUrl || undefined,
            },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            alert("המוצר נוסף בהצלחה");
            reset();
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
            navigate("/ManageAmount");
        }
        catch (error: any) {
            alert(error.response?.data?.message || "הוספת המוצר נכשלה");
        }
    }

    return (

        <>
            <Header />
            <form className="card-bakery form-card my-5" onSubmit={handleSubmit(onSubmit)} noValidate>

                <h2 className="page-title mt-0">הזן פרטי מוצר</h2>

                <div className="mb-2">
                    <label className="form-label" htmlFor="name">שם המוצר</label>
                    <input
                        className="form-control"
                        id="name"
                        {...register("name")}
                    />
                    <p className="field-error">{errors.name?.message}</p>
                </div>

                <div className="mb-2">
                    <label className="form-label" htmlFor="company">חברה</label>
                    <input
                        className="form-control"
                        id="company"
                        {...register("company")}
                    />
                    <p className="field-error">{errors.company?.message}</p>
                </div>

                <div className="mb-2">
                    <label className="form-label" htmlFor="category">קטגוריה</label>
                    <select className="form-select" id="category" {...register("category")}>
                        <option value="">בחר קטגוריה</option>
                        {categoryOptions.map((c) => (
                            <option key={c.key} value={c.key}>{c.label}</option>
                        ))}
                    </select>
                    <p className="field-error">{errors.category?.message}</p>
                </div>

                {/* כמות ויחידת מידה */}
                <div className="row mb-2">
                    <div className="col">
                        <label className="form-label" htmlFor="quantityAmount">כמות באריזה</label>
                        <input
                            className="form-control"
                            id="quantityAmount"
                            type="number"
                            step="any"
                            {...register("quantity.amount", { valueAsNumber: true })}
                            placeholder="500"
                        />
                        <p className="field-error">{errors.quantity?.amount?.message}</p>
                    </div>
                    <div className="col">
                        <label className="form-label" htmlFor="quantityUnit">יחידת מידה</label>
                        <select className="form-select" id="quantityUnit" {...register("quantity.unit")}>
                            <option value="">בחר יחידה</option>
                            {unitOptions.map((u) => (
                                <option key={u.key} value={u.key}>{u.label}</option>
                            ))}
                        </select>
                        <p className="field-error">{errors.quantity?.unit?.message}</p>
                    </div>
                </div>

                <div className="mb-2">
                    <label className="form-label" htmlFor="storage">אחסון</label>
                    <select className="form-select" id="storage" {...register("storage")}>
                        <option value="">בחר סוג אחסון</option>
                        {storageOptions.map((s) => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                    </select>
                    <p className="field-error">{errors.storage?.message}</p>
                </div>

                <div className="mb-2">
                    <label className="form-label" htmlFor="price">מחיר (₪)</label>
                    <input
                        className="form-control"
                        id="price"
                        type="number"
                        step="0.01"
                        {...register("price", { valueAsNumber: true })}
                        placeholder="24.90"
                    />
                    <p className="field-error">{errors.price?.message}</p>
                </div>

                <div className="mb-2">
                    <label className="form-label" htmlFor="stock">כמות במלאי</label>
                    <input
                        className="form-control"
                        id="stock"
                        type="number"
                        min="0"
                        {...register("stock", { valueAsNumber: true })}
                    />
                    <p className="field-error">{errors.stock?.message}</p>
                </div>

                <div className="mb-2">
                    <label className="form-label" htmlFor="description">תיאור</label>
                    <textarea
                        className="form-control"
                        id="description"
                        {...register("description")}
                    />
                    <p className="field-error">{errors.description?.message}</p>
                </div>

                <div className="mb-2">
                    <label className="form-label" htmlFor="imageUrl">קישור לתמונה</label>
                    <input
                        className="form-control"
                        id="imageUrl"
                        type="url"
                        dir="ltr"
                        {...register("imageUrl")}
                        placeholder="https://example.com/cream.jpg"
                    />
                    <p className="field-error">{errors.imageUrl?.message}</p>
                </div>

                <button className="btn btn-brown w-100 py-2 mt-3" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "שומר מוצר..." : "הוספת מוצר"}
                </button>
            </form>
        </>
    )
}
export default AddProduct
