import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiErrorMessage } from '../api';
import SocialAuth from '../components/SocialAuth';
import { useAuth } from '../context/AuthContext';

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
    <form className="form auth-form" onSubmit={submit}>
      <p className="eyebrow">Join NovaMart</p>
      <h2>Create an account</h2>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </label>
      {error && <p className="err">{error}</p>}
      <button className="btn primary" type="submit">
        Create account
      </button>
      <SocialAuth />
      <p>
        Already have one? <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}
