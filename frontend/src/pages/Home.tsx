import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import type { CatalogResponse, Product } from '../types';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    api.get<CatalogResponse>('/products').then(({ data }) => {
      setFeatured(data.products.filter((product) => product.featured).slice(0, 4));
    });
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Your first MERN store</p>
          <h1>Objects for a quieter kind of everyday.</h1>
          <p>
            NovaMart is a full e-commerce app built with MongoDB, Express, React, Node, and
            TypeScript. Browse the catalog, sign in, add to bag, and place a demo order.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn primary">
              Open the shop
            </Link>
            <Link to="/register" className="btn ghost">
              Create an account
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
            alt="Editorial shop interior"
          />
          <div className="hero-card">
            <span>Free shipping</span>
            <strong>Orders over $100</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Featured this week</h2>
          <Link to="/shop">View all</Link>
        </div>
        <div className="grid">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
