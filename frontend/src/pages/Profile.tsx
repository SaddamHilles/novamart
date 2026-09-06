import { useState, type FormEvent } from 'react';
import api, { apiErrorMessage } from '../api';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import type { PublicUser } from '../types';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!user) return null;

  function onFile(selected: File | null) {
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    const body = new FormData();
    body.append('name', name);
    if (file) body.append('avatar', file);
    try {
      const { data } = await api.put<{ user: PublicUser }>('/auth/profile', body);
      refreshUser(data.user);
      setPreview(data.user.avatar || '');
      setFile(null);
      setMessage('Profile saved');
      setError('');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not save profile'));
    }
  }

  return (
    <section className="section narrow">
      <p className="eyebrow">Account</p>
      <h2>Your profile</h2>
      <form className="form profile-form" onSubmit={save}>
        <div className="profile-photo">
          <Avatar name={name || user.name} src={preview} size="lg" />
          <label className="btn ghost">
            Choose photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              hidden
              onChange={(e) => onFile(e.target.files?.[0] || null)}
            />
          </label>
          <p className="hint">JPG, PNG, or WebP · up to 2 MB. Google photos appear here after you sign in with Google.</p>
        </div>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input value={user.email} disabled />
        </label>
        {message && <p className="ok">{message}</p>}
        {error && <p className="err">{error}</p>}
        <button className="btn primary" type="submit">
          Save profile
        </button>
      </form>
    </section>
  );
}
