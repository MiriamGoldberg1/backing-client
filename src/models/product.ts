export default interface Product {
    id: number;
    name: string;
    company: string;
    quantity: {
        amount: number;
        unit: string;
    };
    stock?: number;
    price: number;
    description?:string,
    imageUrl: string | null;
}