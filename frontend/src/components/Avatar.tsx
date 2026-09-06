import { useState } from 'react';
import { avatarSrc } from '../avatar';

type AvatarProps = {
  name: string;
  src?: string;
  size?: 'sm' | 'lg';
};

export default function Avatar({ name, src, size = 'sm' }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const url = avatarSrc(src);
  const initial = name.trim().charAt(0).toUpperCase() || 'N';

  if (url && !failed) {
    return (
      <img
        className={`avatar ${size}`}
        src={url}
        alt={`${name} avatar`}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    );
  }

  return <span className={`avatar fallback ${size}`}>{initial}</span>;
}
