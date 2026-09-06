import { useEffect, useState, type FormEvent } from 'react';
import api from '../api';
import type { CatalogResponse, Product, ProductForm } from '../types';

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
    <section className="cart-layout">
      <form className="form" onSubmit={createProduct}>
        <h2>Add a product</h2>
        {textFields.map((field) => (
          <label key={field}>
            {field}
            {field === 'description' ? (
              <textarea
                rows={3}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
              />
            ) : (
              <input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
              />
            )}
          </label>
        ))}
        <label>
          Price
          <input
            type="number"
            min={1}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </label>
        <label>
          Stock
          <input
            type="number"
            min={0}
            value={form.countInStock}
            onChange={(e) => setForm({ ...form, countInStock: Number(e.target.value) })}
          />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured on home
        </label>
        {message && <p className="ok">{message}</p>}
        <button className="btn primary" type="submit">
          Save product
        </button>
      </form>
      <div>
        <h3>Inventory</h3>
        {products.map((product) => (
          <article key={product._id} className="order-row">
            <div>
              <strong>{product.name}</strong>
              <p>
                ${product.price} · {product.countInStock} left
              </p>
            </div>
            <button type="button" className="text-btn" onClick={() => remove(product._id)}>
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
