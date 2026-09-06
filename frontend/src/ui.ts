export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const btn =
  'inline-flex items-center justify-center rounded-full border border-ink px-[18px] py-3 cursor-pointer disabled:pointer-events-none disabled:opacity-45';

export const btnPrimary = cn(btn, 'bg-ink text-paper');

export const btnGhost = cn(btn, 'bg-transparent');

export const field = 'w-full min-w-0 border border-line bg-white rounded-[14px] px-3 py-2.5';

export const card = 'bg-card border border-line rounded-[22px]';

export const paddedCard = cn(card, 'px-[18px] py-4');

export const label = 'grid gap-1.5 text-[0.92rem]';

export const eyebrow = 'text-muted';

export const pageStatus = 'py-12 text-muted';

export const productGrid = 'grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-[18px]';

export const sectionHead = 'mb-5 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end';

export const catLink =
  'whitespace-nowrap rounded-full px-3 py-1.5 text-[0.9rem] text-muted hover:bg-ink hover:text-paper md:py-1.5';
