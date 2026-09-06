import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Avatar from './Avatar';
import type { CatalogResponse } from '../types';
import { catLink, cn } from '../ui';

const shell = 'mx-auto w-[min(1120px,calc(100%-32px))]';
const toolLink =
  'flex items-center gap-2.5 rounded-[14px] px-2.5 py-1.5 hover:bg-ink/5 group-hover:bg-ink/5';
const toolCopy = 'hidden leading-[1.15] font-bold md:grid';
const dropItem =
  'block w-full rounded-[10px] bg-transparent px-3 py-2.5 text-left hover:bg-ink/6';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('search') || '');
  const [categories, setCategories] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setQuery(params.get('search') || '');
  }, [params]);

  useEffect(() => {
    api.get<CatalogResponse>('/products').then(({ data }) => setCategories(data.categories));
  }, []);

  function searchShop(e: FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams();
    if (query.trim()) next.set('search', query.trim());
    navigate(`/shop?${next.toString()}`);
    setMenuOpen(false);
  }

  const activeCategory = params.get('category') || '';
  const shopAllActive = location.pathname === '/shop' && !activeCategory;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-card/92 shadow-[0_8px_24px_rgb(27_23_18/0.04)] backdrop-blur-2xl">
      <div className="flex items-center justify-center gap-2.5 bg-ink px-4 py-2 text-[0.78rem] tracking-[0.04em] text-paper">
        <span>Free shipping on orders over $100</span>
        <span className="hidden opacity-45 md:inline">·</span>
        <span className="hidden md:inline">Easy 30-day returns</span>
      </div>

      <div className={cn(shell, 'grid grid-cols-[1fr_auto] items-center gap-3 py-3.5 pb-3 md:grid-cols-[auto_1fr_auto] md:gap-7')}>
        <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap font-serif text-[1.45rem] leading-[1.1] font-[650]" onClick={() => setMenuOpen(false)}>
          <span className="grid size-[38px] place-items-center rounded-xl bg-ink font-serif text-[1.1rem] text-paper">
            N
          </span>
          <span>
            NovaMart
            <small className="mt-0.5 hidden font-sans text-[0.68rem] font-semibold tracking-[0.04em] text-muted md:block">
              Curated everyday goods
            </small>
          </span>
        </Link>

        <form
          className="order-3 col-span-full flex min-w-0 items-center gap-2.5 rounded-full border border-line bg-white py-1 pr-1 pl-3.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.8)] md:order-none md:col-auto"
          onSubmit={searchShop}
        >
          <SearchIcon />
          <input
            type="search"
            className="min-w-0 flex-1 border-0 bg-transparent py-2 outline-none"
            placeholder="Search products, brands, categories"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the shop"
          />
          <button type="submit" className="cursor-pointer rounded-full bg-ink px-4 py-2 text-[0.88rem] text-paper">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="group relative">
              <Link to="/profile" className={toolLink}>
                <Avatar name={user.name} src={user.avatar} />
                <span className={toolCopy}>
                  <small className="font-medium text-muted">Hello, {user.name.split(' ')[0]}</small>
                  Account
                </span>
              </Link>
              <div className="absolute top-[calc(100%+8px)] right-0 hidden min-w-[180px] grid-cols-1 rounded-2xl border border-line bg-card p-2 shadow-[0_16px_40px_rgb(27_23_18/0.12)] md:group-hover:grid md:group-focus-within:grid">
                <Link to="/profile" className={dropItem}>
                  Your profile
                </Link>
                <Link to="/orders" className={dropItem}>
                  Your orders
                </Link>
                {user.isAdmin && (
                  <Link to="/admin" className={dropItem}>
                    Admin
                  </Link>
                )}
                <button type="button" className={cn(dropItem, 'cursor-pointer')} onClick={logout}>
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className={toolLink}>
              <UserIcon />
              <span className={toolCopy}>
                <small className="font-medium text-muted">Welcome</small>
                Sign in
              </span>
            </Link>
          )}

          <Link to="/cart" className={toolLink}>
            <span className="relative grid place-items-center">
              <BagIcon />
              {count > 0 && (
                <em className="absolute -top-1.5 -right-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ochre px-1 text-[0.68rem] not-italic font-extrabold text-white">
                  {count}
                </em>
              )}
            </span>
            <span className={toolCopy}>
              <small className="font-medium text-muted">Your bag</small>
              Cart
            </span>
          </Link>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl border border-line bg-white text-[1.1rem] md:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>
        </div>
      </div>

      <nav
        className={cn(
          shell,
          menuOpen ? 'flex' : 'hidden',
          'flex-col items-stretch gap-1.5 overflow-x-auto pb-4 md:flex md:flex-row md:items-center md:pb-3',
        )}
      >
        <Link
          to="/shop"
          className={cn(catLink, shopAllActive && 'bg-ink text-paper')}
          onClick={() => setMenuOpen(false)}
        >
          Shop all
        </Link>
        {categories.map((item) => (
          <Link
            key={item}
            to={`/shop?category=${encodeURIComponent(item)}`}
            className={cn(catLink, activeCategory === item && 'bg-ink text-paper')}
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </Link>
        ))}
        {user && (
          <NavLink
            to="/orders"
            className={({ isActive }) => cn(catLink, 'md:hidden', isActive && 'bg-ink text-paper')}
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </NavLink>
        )}
        {user?.isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => cn(catLink, 'md:hidden', isActive && 'bg-ink text-paper')}
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </NavLink>
        )}
        <div className="mt-2 grid gap-1 border-t border-line pt-2 md:hidden">
          {user ? (
            <>
              <Link to="/profile" className={catLink} onClick={() => setMenuOpen(false)}>
                Account
              </Link>
              <button
                type="button"
                className={cn(catLink, 'cursor-pointer bg-transparent text-left')}
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className={catLink} onClick={() => setMenuOpen(false)}>
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg className="shrink-0 text-muted" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 8V7a5 5 0 0 1 10 0v1h3v13H4V8h3zm2 0h6V7a3 3 0 0 0-6 0v1z"
      />
    </svg>
  );
}
