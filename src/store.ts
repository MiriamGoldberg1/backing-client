//המחסן המרכזי של Redux - כאן נרשמים כל ה reducers
import { configureStore } from '@reduxjs/toolkit';
import cart from './models/cartSlice';

export const store = configureStore({ reducer: { cart } });

//שמירת העגלה ב LocalStorage לפי המשתמש בכל שינוי
store.subscribe(() => {
  const { userId, items } = store.getState().cart;
  if (userId) localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
