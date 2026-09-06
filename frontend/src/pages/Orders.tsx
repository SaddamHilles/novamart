import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import type { Order } from '../types';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.get<Order[]>('/orders/mine').then(({ data }) => setOrders(data));
  }, []);

  return (
    <section className="section">
      <h2>Your orders</h2>
      {!orders.length && <p className="page-status">No orders yet.</p>}
      <div className="order-list">
        {orders.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`} className="order-row">
            <div>
              <strong>#{order._id.slice(-6)}</strong>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span>{order.status}</span>
            <strong>${order.totalPrice.toFixed(2)}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
