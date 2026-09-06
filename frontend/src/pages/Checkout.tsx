import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { apiErrorMessage } from '../api';
import { useCart } from '../context/CartContext';
import type { Order, PaymentMethod, ShippingAddress } from '../types';
import { btnPrimary, field, label, paddedCard } from '../ui';

const empty: ShippingAddress = { address: '', city: '', postalCode: '', country: '' };
const fields: Array<keyof ShippingAddress> = ['address', 'city', 'postalCode', 'country'];

export default function Checkout() {
  const { cart, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState<ShippingAddress>(empty);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
  const [error, setError] = useState('');

  const shippingPrice = subtotal > 100 || subtotal === 0 ? 0 : 8;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = (subtotal + shippingPrice + tax).toFixed(2);

  async function placeOrder(e: FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post<Order>('/orders', { shippingAddress: shipping, paymentMethod });
      clear();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not place order'));
    }
  }

  return (
    <section className="flex flex-col items-start gap-6 pt-8 md:flex-row">
      <form className={`${paddedCard} grid flex-1 gap-3`} onSubmit={placeOrder}>
        <h2>Checkout</h2>
        {fields.map((name) => (
          <label key={name} className={label}>
            {name === 'postalCode' ? 'Postal code' : name[0].toUpperCase() + name.slice(1)}
            <input
              className={field}
              required
              value={shipping[name]}
              onChange={(e) => setShipping({ ...shipping, [name]: e.target.value })}
            />
          </label>
        ))}
        <label className={label}>
          Payment
          <select
            className={field}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            <option>Card</option>
            <option>Cash on Delivery</option>
          </select>
        </label>
        {error && <p className="text-err">{error}</p>}
        <button className={btnPrimary} type="submit" disabled={!cart.length}>
          Place order · ${total}
        </button>
      </form>
      <aside className={`${paddedCard} sticky top-[148px] flex-1`}>
        <h3>{cart.length} items</h3>
        {cart.map((item) => (
          <p key={item.product} className="flex items-center justify-between gap-3">
            <span>
              {item.name} × {item.qty}
            </span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </p>
        ))}
        <p className="flex items-center justify-between gap-3 text-[1.15rem] font-bold">
          <span>Total</span>
          <span>${total}</span>
        </p>
      </aside>
    </section>
  );
}
