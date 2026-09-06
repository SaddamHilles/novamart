export function avatarSrc(avatar?: string) {
  if (!avatar) return '';
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  return avatar;
}
