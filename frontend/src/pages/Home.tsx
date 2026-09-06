import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import type { CatalogResponse, Product } from '../types';
import { btnGhost, btnPrimary, eyebrow, productGrid, sectionHead } from '../ui';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    api.get<CatalogResponse>('/products').then(({ data }) => {
      setFeatured(data.products.filter((product) => product.featured).slice(0, 4));
    });
  }, []);

  return (
    <div>
      <section className="flex flex-col items-center gap-6 pt-12 pb-6 md:flex-row">
        <div className="flex-1">
          <p className={eyebrow}>Your first MERN store</p>
          <h1 className="my-2.5 mb-4 font-serif text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.05]">
            Objects for a quieter kind of everyday.
          </h1>
          <p className="max-w-[34rem] text-[1.05rem] leading-[1.7] text-muted">
            NovaMart is a full e-commerce app built with MongoDB, Express, React, Node, and
            TypeScript. Browse the catalog, sign in, add to bag, and place a demo order.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Link to="/shop" className={btnPrimary}>
              Open the shop
            </Link>
            <Link to="/register" className={btnGhost}>
              Create an account
            </Link>
          </div>
        </div>
        <div className="relative flex-1">
          <img
            className="h-[280px] w-full rounded-[28px] object-cover md:h-[460px]"
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
            alt="Editorial shop interior"
          />
          <div className="absolute bottom-5 left-5 rounded-2xl bg-card px-[18px] py-4 shadow-[0_12px_40px_rgb(27_23_18/0.12)]">
            <span className="block text-[0.85rem] text-muted">Free shipping</span>
            <strong>Orders over $100</strong>
          </div>
        </div>
      </section>

      <section className="pt-7">
        <div className={sectionHead}>
          <h2>Featured this week</h2>
          <Link to="/shop">View all</Link>
        </div>
        <div className={productGrid}>
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
