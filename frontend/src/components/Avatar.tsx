import { useState } from 'react';
import { avatarSrc } from '../avatar';
import { cn } from '../ui';

type AvatarProps = {
  name: string;
  src?: string;
  size?: 'sm' | 'lg';
};

export default function Avatar({ name, src, size = 'sm' }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const url = avatarSrc(src);
  const initial = name.trim().charAt(0).toUpperCase() || 'N';
  const box = cn(
    'shrink-0 rounded-full object-cover bg-sand',
    size === 'lg' ? 'size-28' : 'size-8',
  );

  if (url && !failed) {
    return (
      <img
        className={box}
        src={url}
        alt={`${name} avatar`}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className={cn(box, 'grid place-items-center bg-ink font-bold text-paper')}>{initial}</span>
  );
}
