import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const { completeOAuth } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setError('Social sign-in did not return a session.');
      return;
    }
    completeOAuth(token)
      .then(() => navigate('/shop', { replace: true }))
      .catch(() => setError('Could not finish social sign-in.'));
  }, [completeOAuth, navigate, params]);

  return (
    <section className="section narrow">
      <h2>{error || 'Finishing sign-in…'}</h2>
    </section>
  );
}
