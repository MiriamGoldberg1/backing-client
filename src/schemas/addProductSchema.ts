import { z } from "zod";


export const categoryOptions = [
    { key: "creams_fillings", label: "קרמים ומליות" },
    { key: "doughs_bases", label: "בצקים ובסיסים מוכנים" },
    { key: "chocolates", label: "שוקולדים" },
    { key: "cake_decorations", label: "קישוטי עוגה" },
    { key: "extracts_powders", label: "תמציות טעם ואבקות" },
    { key: "food_colors", label: "צבעי מאכל" },
    { key: "misc", label: "שונות" },
];

export const unitOptions = [
    { key: "g", label: "גרם" },
    { key: "mg", label: "מיליגרם" },
    { key: "kg", label: "קילוגרם" },
    { key: "l", label: "ליטר" },
];

export const storageOptions = [
    { key: "frozen", label: "בהקפאה" },
    { key: "dry", label: "יבש" },
    { key: "refrigerated", label: "בקירור" },
];

export const addProductSchema = z.object(
    {
        name: z.string().trim().min(2, "שם המוצר חייב להכיל לפחות 2 תווים").max(120, "שם המוצר ארוך מדי"),
        company: z.string().trim().min(2, "שם החברה חייב להכיל לפחות 2 תווים").max(120, "שם החברה ארוך מדי"),
        category: z.enum(
            ["creams_fillings", "doughs_bases", "chocolates", "cake_decorations", "extracts_powders", "food_colors", "misc"],
            { error: "יש לבחור קטגוריה" }
        ),
        quantity: z.object({
            amount: z.number({ error: "יש להזין כמות" }).positive("הכמות חייבת להיות גדולה מ-0"),
            unit: z.enum(["g", "mg", "kg", "l"], { error: "יש לבחור יחידת מידה" }),
        }),
        storage: z.enum(["frozen", "dry", "refrigerated"], { error: "יש לבחור סוג אחסון" }),
        price: z.number({ error: "יש להזין מחיר" }).positive("המחיר חייב להיות גדול מ-0"),
        stock: z.number({ error: "יש להזין כמות במלאי" }).int("הכמות במלאי חייבת להיות מספר שלם").min(0, "הכמות במלאי לא יכולה להיות שלילית"),
        description: z.string().max(1000, "התיאור ארוך מדי"),
        // שדה רשות - ריק או כתובת תקינה
        imageUrl: z.union([z.url("יש להזין קישור תקין לתמונה"), z.literal("")]),
    }
);



export type AddProductFormData = z.infer<typeof addProductSchema>;
