import { useEffect, useState, type FormEvent } from 'react';
import api from '../api';
import type { CatalogResponse, Product, ProductForm } from '../types';
import { btnPrimary, field, label, paddedCard } from '../ui';

const blank: ProductForm = {
  name: '',
  brand: '',
  category: 'Accessories',
  description: '',
  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
  price: 49,
  countInStock: 10,
  featured: false,
};

const textFields = ['name', 'brand', 'category', 'image', 'description'] as const;

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(blank);
  const [message, setMessage] = useState('');

  const load = () =>
    api.get<CatalogResponse>('/products').then(({ data }) => setProducts(data.products));

  useEffect(() => {
    load();
  }, []);

  async function createProduct(e: FormEvent) {
    e.preventDefault();
    await api.post('/products', form);
    setForm(blank);
    setMessage('Product added');
    load();
  }

  async function remove(id: string) {
    await api.delete(`/products/${id}`);
    load();
  }

  return (
    <section className="flex flex-col items-start gap-6 pt-8 md:flex-row">
      <form className={`${paddedCard} grid flex-1 gap-3`} onSubmit={createProduct}>
        <h2>Add a product</h2>
        {textFields.map((name) => (
          <label key={name} className={label}>
            {name}
            {name === 'description' ? (
              <textarea
                className={field}
                rows={3}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                required
              />
            ) : (
              <input
                className={field}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                required
              />
            )}
          </label>
        ))}
        <label className={label}>
          Price
          <input
            className={field}
            type="number"
            min={1}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </label>
        <label className={label}>
          Stock
          <input
            className={field}
            type="number"
            min={0}
            value={form.countInStock}
            onChange={(e) => setForm({ ...form, countInStock: Number(e.target.value) })}
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured on home
        </label>
        {message && <p className="text-ok">{message}</p>}
        <button className={btnPrimary} type="submit">
          Save product
        </button>
      </form>
      <div className="flex-1">
        <h3>Inventory</h3>
        {products.map((product) => (
          <article key={product._id} className={`${paddedCard} mb-2.5 flex items-center justify-between gap-3`}>
            <div>
              <strong>{product.name}</strong>
              <p>
                ${product.price} · {product.countInStock} left
              </p>
            </div>
            <button type="button" className="cursor-pointer border-0 bg-transparent" onClick={() => remove(product._id)}>
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
