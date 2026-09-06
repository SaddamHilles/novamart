import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Avatar from './Avatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">N</span>
          NovaMart
        </Link>
        <nav className="nav-links">
          <NavLink to="/shop">Shop</NavLink>
          {user && <NavLink to="/orders">Orders</NavLink>}
          {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-actions">
          <Link to="/cart" className="cart-link">
            Bag <span>{count}</span>
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="nav-profile">
                <Avatar name={user.name} src={user.avatar} />
                <span className="nav-user">{user.name.split(' ')[0]}</span>
              </Link>
              <button type="button" className="text-btn" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="text-btn">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
