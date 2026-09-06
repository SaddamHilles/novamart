import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiErrorMessage } from '../api';
import SocialAuth from '../components/SocialAuth';
import { useAuth } from '../context/AuthContext';
import { btnPrimary, eyebrow, field, label, paddedCard } from '../ui';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/shop');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not create account'));
    }
  }

  return (
    <form className={`${paddedCard} mx-auto mt-12 grid w-[min(460px,100%)] gap-3`} onSubmit={submit}>
      <p className={eyebrow}>Join NovaMart</p>
      <h2>Create an account</h2>
      <label className={label}>
        Name
        <input className={field} value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
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
          minLength={6}
        />
      </label>
      {error && <p className="text-err">{error}</p>}
      <button className={btnPrimary} type="submit">
        Create account
      </button>
      <SocialAuth />
      <p>
        Already have one? <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}
