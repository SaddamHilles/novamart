import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { apiErrorMessage } from '../api';
import { useCart } from '../context/CartContext';
import type { Order, PaymentMethod, ShippingAddress } from '../types';

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
    <section className="cart-layout">
      <form className="form" onSubmit={placeOrder}>
        <h2>Checkout</h2>
        {fields.map((field) => (
          <label key={field}>
            {field === 'postalCode' ? 'Postal code' : field[0].toUpperCase() + field.slice(1)}
            <input
              required
              value={shipping[field]}
              onChange={(e) => setShipping({ ...shipping, [field]: e.target.value })}
            />
          </label>
        ))}
        <label>
          Payment
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            <option>Card</option>
            <option>Cash on Delivery</option>
          </select>
        </label>
        {error && <p className="err">{error}</p>}
        <button className="btn primary" type="submit" disabled={!cart.length}>
          Place order · ${total}
        </button>
      </form>
      <aside className="summary">
        <h3>{cart.length} items</h3>
        {cart.map((item) => (
          <p key={item.product}>
            <span>
              {item.name} × {item.qty}
            </span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </p>
        ))}
        <p className="total">
          <span>Total</span>
          <span>${total}</span>
        </p>
      </aside>
    </section>
  );
}
