import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiErrorMessage } from '../api';
import SocialAuth from '../components/SocialAuth';
import { useAuth } from '../context/AuthContext';
import { btnPrimary, eyebrow, field, label, paddedCard } from '../ui';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('demo@novamart.dev');
  const [password, setPassword] = useState('Demo123!');
  const [error, setError] = useState(params.get('error') || '');

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/shop');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not sign in'));
    }
  }

  return (
    <form className={`${paddedCard} mx-auto mt-12 grid w-[min(460px,100%)] gap-3`} onSubmit={submit}>
      <p className={eyebrow}>Welcome back</p>
      <h2>Sign in</h2>
      <label className={label}>
        Email
        <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className={label}>
        Password
        <input
          className={field}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <p className="text-err">{error}</p>}
      <button className={btnPrimary} type="submit">
        Continue
      </button>
      <SocialAuth />
      <p className="text-muted">Demo account is prefilled. Admin: admin@novamart.dev / Admin123!</p>
      <p>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </form>
  );
}
