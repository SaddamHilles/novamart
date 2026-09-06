import { useState } from 'react';

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  label?: string;
};

export default function StarRating({ value, onChange, label }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  const interactive = Boolean(onChange);

  return (
    <div className="star-rating">
      {label && <span className="star-rating-label">{label}</span>}
      <div
        className={interactive ? 'star-row interactive' : 'star-row'}
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={`${value} out of 5 stars`}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={star <= shown ? 'star on' : 'star'}
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
            aria-checked={interactive ? star === value : undefined}
            role={interactive ? 'radio' : undefined}
            disabled={!interactive}
            onMouseEnter={() => interactive && setHover(star)}
            onClick={() => onChange?.(star)}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
