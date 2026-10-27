import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { addItem, decreaseItem, removeItem } from '../models/cartSlice';
import Header from '../components/Header';
import { useNavigate } from 'react-router';


const MyCart = () => {
    const items = useSelector((s: RootState) => s.cart.items);
    const dispatch = useDispatch();

    const navigae = useNavigate()
    return (
        <>
            <Header />
            <div className="cart-grid">
                {items.length === 0 && <p>העגלה ריקה</p>}
                {items.map(a => (
                    <div className="cart-card" key={a.id}>
                        <div className="cart-card-body">
                            <button className="cart-remove" onClick={() => dispatch(removeItem(a.id))}>מחק מוצר</button>
                            {a.imageUrl ? <img className="cart-img" src={a.imageUrl} alt={a.name} /> : <div className="cart-img">🧁</div>}
                            <div>{a.name}</div>
                            <div>{a.company}</div>
                            <div>מחיר ליחידה ₪{a.price}  </div>
                            {/* //סה"כ- להציג רק2 ספרות אחרי הנקודה */}
                            <div> סה"כ  ₪{(a.price * a.qty).toFixed(2)} </div>
                        </div>
                        <div className="cart-qty">
                            <button onClick={() => dispatch(addItem(a))}>+</button>
                            <span>{a.qty}</span>
                            <button onClick={() => dispatch(decreaseItem(a.id))}>-</button>
                        </div>
                    </div>
                ))}
            </div>
            {/*רק כשיש מוצרים בעגלה אפשר לשלם*/}
            {items.length != 0 &&
                <button className="btn btn-brown btn-sm" onClick={() => {
                    const sumPrice = items.filter(i => i.qty > 0).reduce((sum, i) => sum + i.price * i.qty, 0);
                    navigae("/AsPayment", { state: { sumPrice } })
                }}
                >לתשלום</button>
            }
        </>
    );
};
export default MyCart;


