import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { btnPrimary, cn, field, paddedCard, pageStatus } from '../ui';

export default function Cart() {
  const { user } = useAuth();
  const { cart, update, remove, subtotal } = useCart();
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 8;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = (subtotal + shipping + tax).toFixed(2);

  if (!user) {
    return (
      <section className="pt-8">
        <h2>Your bag</h2>
        <p>Sign in to keep a cart that follows you across pages.</p>
        <Link to="/login" className={cn(btnPrimary, 'mt-4')}>
          Sign in
        </Link>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-start gap-6 pt-8 md:flex-row">
      <div className="flex-1">
        <h2>Your bag</h2>
        {!cart.length && <p className={pageStatus}>Nothing here yet. The shop is waiting.</p>}
        {cart.map((item) => (
          <article key={item.product} className={`${paddedCard} mb-3 grid grid-cols-[120px_1fr] gap-4`}>
            <img className="h-[120px] w-full rounded-2xl object-cover" src={item.image} alt={item.name} />
            <div>
              <h3 className="my-1 mb-2.5">{item.name}</h3>
              <p>${item.price}</p>
              <div className="flex items-center gap-4">
                <select
                  className={`${field} w-auto`}
                  value={item.qty}
                  onChange={(e) => update(item.product, Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button type="button" className="cursor-pointer border-0 bg-transparent" onClick={() => remove(item.product)}>
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className={`${paddedCard} sticky top-[148px] flex-1`}>
        <h3>Summary</h3>
        <p className="flex items-center justify-between gap-3">
          <span>Subtotal</span> <span>${subtotal.toFixed(2)}</span>
        </p>
        <p className="flex items-center justify-between gap-3">
          <span>Shipping</span> <span>{shipping ? `$${shipping}` : 'Free'}</span>
        </p>
        <p className="flex items-center justify-between gap-3">
          <span>Tax</span> <span>${tax.toFixed(2)}</span>
        </p>
        <p className="flex items-center justify-between gap-3 text-[1.15rem] font-bold">
          <span>Total</span> <span>${total}</span>
        </p>
        <Link to="/checkout" className={cn(btnPrimary, 'mt-3', !cart.length && 'pointer-events-none opacity-45')}>
          Checkout
        </Link>
      </aside>
    </section>
  );
}
