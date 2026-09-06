import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { user } = useAuth();
  const { cart, update, remove, subtotal } = useCart();
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 8;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = (subtotal + shipping + tax).toFixed(2);

  if (!user) {
    return (
      <section className="section narrow">
        <h2>Your bag</h2>
        <p>Sign in to keep a cart that follows you across pages.</p>
        <Link to="/login" className="btn primary">
          Sign in
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-layout">
      <div>
        <h2>Your bag</h2>
        {!cart.length && <p className="page-status">Nothing here yet. The shop is waiting.</p>}
        {cart.map((item) => (
          <article key={item.product} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <div className="buy-row">
                <select value={item.qty} onChange={(e) => update(item.product, Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button type="button" className="text-btn" onClick={() => remove(item.product)}>
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className="summary">
        <h3>Summary</h3>
        <p>
          <span>Subtotal</span> <span>${subtotal.toFixed(2)}</span>
        </p>
        <p>
          <span>Shipping</span> <span>{shipping ? `$${shipping}` : 'Free'}</span>
        </p>
        <p>
          <span>Tax</span> <span>${tax.toFixed(2)}</span>
        </p>
        <p className="total">
          <span>Total</span> <span>${total}</span>
        </p>
        <Link to="/checkout" className={`btn primary ${cart.length ? '' : 'disabled'}`}>
          Checkout
        </Link>
      </aside>
    </section>
  );
}
