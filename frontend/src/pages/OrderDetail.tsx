import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import type { Order } from '../types';
import { eyebrow, paddedCard, pageStatus } from '../ui';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get<Order>(`/orders/${id}`).then(({ data }) => setOrder(data));
  }, [id]);

  if (!order) return <div className={pageStatus}>Loading order…</div>;

  return (
    <section className="pt-8">
      <p className={eyebrow}>Order #{order._id.slice(-6)}</p>
      <h2>{order.status}</h2>
      <p>
        {order.isPaid && order.paidAt
          ? `Paid ${new Date(order.paidAt).toLocaleString()}`
          : 'Payment pending'}{' '}
        · {order.paymentMethod}
      </p>
      <div>
        {order.orderItems.map((item) => (
          <article key={item.product} className={`${paddedCard} mb-3 grid grid-cols-[120px_1fr] gap-4`}>
            <img className="h-[120px] w-full rounded-2xl object-cover" src={item.image} alt={item.name} />
            <div>
              <h3 className="my-1 mb-2.5">{item.name}</h3>
              <p>
                {item.qty} × ${item.price}
              </p>
            </div>
          </article>
        ))}
      </div>
      <aside className={`${paddedCard} sticky top-[148px] mt-4`}>
        <p className="flex items-center justify-between gap-3">
          <span>Ship to</span>
          <span>
            {order.shippingAddress.address}, {order.shippingAddress.city}
          </span>
        </p>
        <p className="flex items-center justify-between gap-3 text-[1.15rem] font-bold">
          <span>Total</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </p>
      </aside>
    </section>
  );
}
