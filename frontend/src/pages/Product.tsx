import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { apiErrorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';
import type { Product as ProductType } from '../types';
import { btnPrimary, eyebrow, field, paddedCard, pageStatus } from '../ui';

export default function Product() {
  const { id } = useParams();
  const { user } = useAuth();
  const { add } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get<ProductType>(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <div className={pageStatus}>Loading product…</div>;

  async function addToBag() {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!product) return;
    try {
      await add(product._id, qty);
      setMessage('Added to bag');
      setError('');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not add to bag'));
    }
  }

  async function submitReview(e: FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post<ProductType>(`/products/${id}/reviews`, { rating, comment });
      setProduct(data);
      setComment('');
      setMessage('Review published');
      setError('');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not save review'));
    }
  }

  return (
    <section className="pt-8">
      <div className="flex flex-col gap-6 md:flex-row">
        <img
          className="h-[280px] w-full flex-1 rounded-[28px] object-cover md:h-[460px]"
          src={product.image}
          alt={product.name}
        />
        <div className="flex-1">
          <p className={eyebrow}>
            {product.brand} · {product.category}
          </p>
          <h1 className="my-2.5 mb-4 font-serif text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.05]">
            {product.name}
          </h1>
          <p className="max-w-[34rem] text-[1.05rem] leading-[1.7] text-muted">{product.description}</p>
          <p className="my-2 font-serif text-[2rem]">${product.price}</p>
          <p className="text-muted">
            {product.rating.toFixed(1)} ★ · {product.numReviews} reviews · {product.countInStock} in
            stock
          </p>
          <div className="mt-4 flex items-center gap-4">
            <select className={`${field} w-auto`} value={qty} onChange={(e) => setQty(Number(e.target.value))}>
              {Array.from({ length: Math.min(product.countInStock, 8) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <button type="button" className={btnPrimary} onClick={addToBag} disabled={!product.countInStock}>
              {product.countInStock ? 'Add to bag' : 'Sold out'}
            </button>
          </div>
          {message && <p className="text-ok">{message}</p>}
          {error && <p className="text-err">{error}</p>}
        </div>
      </div>

      <div className="mt-9">
        <h2>Reviews</h2>
        {product.reviews.map((review) => (
          <article key={review._id} className={`${paddedCard} mb-3`}>
            <strong>{review.name}</strong>
            <StarRating value={review.rating} />
            <p>{review.comment}</p>
          </article>
        ))}
        {user ? (
          <form className="mt-[18px] grid gap-2.5" onSubmit={submitReview}>
            <h3>Write a review</h3>
            <StarRating value={rating} onChange={setRating} label="Your rating" />
            <textarea
              className={field}
              required
              rows={3}
              placeholder="How has it held up?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className={btnPrimary} type="submit">
              Publish
            </button>
          </form>
        ) : (
          <p>Sign in to leave a review.</p>
        )}
      </div>
    </section>
  );
}
