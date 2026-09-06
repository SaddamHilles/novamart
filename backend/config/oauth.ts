import { User, type UserDocument } from '../models/User';

export type OAuthProvider = 'google' | 'facebook' | 'github';

type OAuthProfile = {
  provider: OAuthProvider;
  providerId: string;
  email?: string;
  name: string;
  avatar?: string;
};

function applyProviderId(user: UserDocument, provider: OAuthProvider, providerId: string) {
  if (provider === 'google') user.googleId = providerId;
  if (provider === 'facebook') user.facebookId = providerId;
  if (provider === 'github') user.githubId = providerId;
}

function applyAvatar(user: UserDocument, profile: OAuthProfile) {
  if (!profile.avatar || user.avatarSource === 'upload') return;
  user.avatar = profile.avatar;
  user.avatarSource = profile.provider;
}

export async function upsertOAuthUser(profile: OAuthProfile) {
  const query =
    profile.provider === 'google'
      ? { googleId: profile.providerId }
      : profile.provider === 'facebook'
        ? { facebookId: profile.providerId }
        : { githubId: profile.providerId };

  const existingByProvider = await User.findOne(query);
  if (existingByProvider) {
    applyAvatar(existingByProvider, profile);
    await existingByProvider.save();
    return existingByProvider;
  }

  if (profile.email) {
    const existingByEmail = await User.findOne({ email: profile.email });
    if (existingByEmail) {
      applyProviderId(existingByEmail, profile.provider, profile.providerId);
      applyAvatar(existingByEmail, profile);
      await existingByEmail.save();
      return existingByEmail;
    }
  }

  const email = profile.email || `${profile.provider}-${profile.providerId}@oauth.novamart.local`;
  return User.create({
    name: profile.name || 'NovaMart shopper',
    email,
    googleId: profile.provider === 'google' ? profile.providerId : undefined,
    facebookId: profile.provider === 'facebook' ? profile.providerId : undefined,
    githubId: profile.provider === 'github' ? profile.providerId : undefined,
    avatar: profile.avatar,
    avatarSource: profile.avatar ? profile.provider : undefined,
  });
}

export function clientOrigins() {
  const fromEnv = (process.env.CLIENT_URL || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return [
    ...new Set([
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://192.168.100.2:5173',
      ...fromEnv,
    ]),
  ];
}

export function clientUrl() {
  const first = (process.env.CLIENT_URL || '').split(',')[0]?.trim();
  return first || 'http://localhost:5173';
}

export function apiUrl() {
  return process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
}

export function isGoogleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function isFacebookConfigured() {
  return Boolean(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET);
}

export function isGithubConfigured() {
  return Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
}
