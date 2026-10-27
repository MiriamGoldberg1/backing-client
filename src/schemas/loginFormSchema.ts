import { z } from "zod";

export const loginFormSchema = z.object(
    {
        fullName: z.string().trim().min(4, "שם משתמש חייב להכיל לפחות 4 תווים"),
        email: z.email("יש להזין כתובת אימייל תקינה"),
        phone: z.string().min(9, "מספר הטלפון אינו תקין"),
        address: z.string().min(3),
        password: z.string().min(6, "הסיסמה חייבת להכיל לפחות 6 תווים"),
        confirmPassword: z.string().min(1, "יש להזין שוב את הסיסמה לאימות"),
        note: z.string()
    }
    // אימות הסיסמה
).refine((data) => data.password === data.confirmPassword, {
    message: "הסיסמאות אינן תואמות",
    path: ["confirmPassword"],   
});



export type LoginFormData = z.infer<typeof loginFormSchema>;