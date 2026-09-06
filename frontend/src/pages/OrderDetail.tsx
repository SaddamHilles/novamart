import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import type { Order } from '../types';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get<Order>(`/orders/${id}`).then(({ data }) => setOrder(data));
  }, [id]);

  if (!order) return <div className="page-status">Loading order…</div>;

  return (
    <section className="section narrow">
      <p className="eyebrow">Order #{order._id.slice(-6)}</p>
      <h2>{order.status}</h2>
      <p>
        {order.isPaid && order.paidAt
          ? `Paid ${new Date(order.paidAt).toLocaleString()}`
          : 'Payment pending'}{' '}
        · {order.paymentMethod}
      </p>
      <div className="order-items">
        {order.orderItems.map((item) => (
          <article key={item.product} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>
                {item.qty} × ${item.price}
              </p>
            </div>
          </article>
        ))}
      </div>
      <aside className="summary">
        <p>
          <span>Ship to</span>
          <span>
            {order.shippingAddress.address}, {order.shippingAddress.city}
          </span>
        </p>
        <p className="total">
          <span>Total</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </p>
      </aside>
    </section>
  );
}
