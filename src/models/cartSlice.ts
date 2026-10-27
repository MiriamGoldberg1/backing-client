//העגלה של המשתמש - נשמרת ב LocalStorage לפי המשתמש, ונשלחת לשרת רק בסיום הקניה
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type Product from './product';

type Item = Product & { qty: number };
type CartState = { userId: string | null; items: Item[] };

const load = (userId: string): Item[] => {
  try {
    return JSON.parse(localStorage.getItem(`cart_${userId}`) || '[]');
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { userId: null, items: [] } as CartState,
  reducers: {
    loginCart: (state, a: PayloadAction<string>) => {
      state.userId = a.payload;
      state.items = load(a.payload);
    },
    //אם המוצר כבר בעגלה - מגדילים כמות, אחרת מוסיפים אותו
    addItem: (state, a: PayloadAction<Product>) => {
      const item = state.items.find(i => i.id === a.payload.id);
      if (item) item.qty++;
      else state.items.push({ ...a.payload, qty: 1 });
    },
    //מורידים כמות באחד, וכשמגיעים ל-0 המוצר יוצא מהעגלה
    decreaseItem: (state, a: PayloadAction<number>) => {
      const item = state.items.find(i => i.id === a.payload);
      if (!item) return;
      if (item.qty > 1) item.qty--;
      else state.items = state.items.filter(i => i.id !== a.payload);
    },
    removeItem: (state, a: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.id !== a.payload);
    },
    //קובעים כמות מדויקת - למשל לפי מה שנותר במלאי
    setQty: (state, a: PayloadAction<{ id: number; qty: number }>) => {
      const item = state.items.find(i => i.id === a.payload.id);
      if (item) item.qty = a.payload.qty;
    },
    clearCart: (state) => {
      state.items = [];
    },
    logoutCart: () => ({ userId: null, items: [] }),
  },
});

export const { loginCart, addItem, decreaseItem, removeItem, setQty, clearCart, logoutCart } = cartSlice.actions;
export default cartSlice.reducer;
