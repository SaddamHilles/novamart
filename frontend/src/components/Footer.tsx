export default function Footer() {
  return (
    <footer className="mx-auto flex w-[min(1120px,calc(100%-32px))] flex-col items-start justify-between gap-6 border-t border-line pt-7 pb-10 md:flex-row md:items-end">
      <div>
        <strong>NovaMart</strong>
        <p>A first MERN stack shop: MongoDB, Express, React, Node, and TypeScript.</p>
      </div>
      <p className="text-muted">Free shipping over $100 · Demo payments only</p>
    </footer>
  );
}
