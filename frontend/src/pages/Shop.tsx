import { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import type { CatalogResponse, Product } from '../types';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    api.get<CatalogResponse>(`/products?${params.toString()}`).then(({ data }) => {
      setProducts(data.products);
      setCategories(['All', ...data.categories]);
    });
  }, [search, category]);

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>The shop</h2>
        </div>
        <input
          className="search"
          placeholder="Search headphones, lamps, bags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="chips">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={item === category ? 'chip active' : 'chip'}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {!products.length && <p className="page-status">No products match that search.</p>}
    </section>
  );
}
