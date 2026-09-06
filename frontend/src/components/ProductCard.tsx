import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { card, eyebrow } from '../ui';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product._id}`} className={`${card} overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-1`}>
      <div>
        <img className="h-[220px] w-full rounded-none object-cover" src={product.image} alt={product.name} />
      </div>
      <div className="px-[18px] py-4">
        <p className={eyebrow}>{product.category}</p>
        <h3 className="my-1 mb-2.5">{product.name}</h3>
        <div className="flex items-center justify-between gap-4">
          <span>${product.price}</span>
          <span className="text-muted">{product.rating.toFixed(1)} ★</span>
        </div>
      </div>
    </Link>
  );
}
