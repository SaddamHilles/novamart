import { Link } from 'react-router-dom';
import type { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-media">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-meta">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="product-row">
          <span>${product.price}</span>
          <span className="stars">{product.rating.toFixed(1)} ★</span>
        </div>
      </div>
    </Link>
  );
}
