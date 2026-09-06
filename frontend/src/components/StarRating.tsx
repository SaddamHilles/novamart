import { useState } from 'react';
import { cn } from '../ui';

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
    <div className="grid gap-1.5">
      {label && <span className="text-[0.92rem] text-muted">{label}</span>}
      <div
        className="flex gap-1"
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={`${value} out of 5 stars`}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={cn(
              'border-0 bg-transparent p-0 text-[1.7rem] leading-none',
              star <= shown ? 'text-ochre' : 'text-[#d2c4ae]',
              interactive ? 'cursor-pointer hover:scale-110 focus-visible:scale-110' : 'cursor-default',
            )}
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
