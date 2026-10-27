// מבנה ההזמנה כמו שהשרת מחזיר 

export interface OrderItem {
    productId: number;
    productName: string;
    company: string;
    category: string;
    categoryLabel: string;
    productQuantity: {
        amount: number;
        unit: string;
        unitLabel: string;
    };
    unitPrice: number;
    quantity: number;
    lineTotal: number;
}

// פרטי הלקוח שהזמין מוחזר רק למנהל 
export interface OrderCustomer {
    id: number;
    fullName: string;
    email: string;
    phone: string;
}

export interface Order {
    id: number;
    // מגיע כמחרוזת ISO - להמיר עם new Date(createdAt) בזמן התצוגה
    createdAt: string;
    total: number;
    itemsCount: number;
    deliveryAddress: string | null;
    notes: string | null;
    items: OrderItem[];
    customer?: OrderCustomer;
}
