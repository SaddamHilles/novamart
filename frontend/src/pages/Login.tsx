import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiErrorMessage } from '../api';
import SocialAuth from '../components/SocialAuth';
import { useAuth } from '../context/AuthContext';

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
    <form className="form auth-form" onSubmit={submit}>
      <p className="eyebrow">Welcome back</p>
      <h2>Sign in</h2>
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p className="err">{error}</p>}
      <button className="btn primary" type="submit">
        Continue
      </button>
      <SocialAuth />
      <p className="hint">
        Demo account is prefilled. Admin: admin@novamart.dev / Admin123!
      </p>
      <p>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </form>
  );
}
