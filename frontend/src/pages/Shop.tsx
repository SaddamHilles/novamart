import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import type { CatalogResponse, Product } from '../types';
import { cn, eyebrow, field, pageStatus, productGrid, sectionHead } from '../ui';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const search = params.get('search') || '';
  const category = params.get('category') || 'All';

  useEffect(() => {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (category) query.set('category', category);
    api.get<CatalogResponse>(`/products?${query.toString()}`).then(({ data }) => {
      setProducts(data.products);
      setCategories(['All', ...data.categories]);
    });
  }, [search, category]);

  function updateParam(key: 'search' | 'category', value: string) {
    const next = new URLSearchParams(params);
    if (!value || value === 'All') next.delete(key);
    else next.set(key, value);
    setParams(next);
  }

  return (
    <section className="pt-7">
      <div className={sectionHead}>
        <div>
          <p className={eyebrow}>Catalog</p>
          <h2>The shop</h2>
        </div>
        <input
          className={cn(field, 'w-full md:w-72')}
          placeholder="Search headphones, lamps, bags…"
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
        />
      </div>
      <div className="mb-7 flex flex-wrap items-center gap-4">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={cn(
              'cursor-pointer rounded-[14px] border border-line bg-white px-3 py-2.5',
              item === category && 'border-ink bg-ink text-paper',
            )}
            onClick={() => updateParam('category', item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className={productGrid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {!products.length && <p className={pageStatus}>No products match that search.</p>}
    </section>
  );
}
