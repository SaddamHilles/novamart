import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User, type UserDocument } from '../models/User';
import {
  apiUrl,
  isFacebookConfigured,
  isGithubConfigured,
  isGoogleConfigured,
  upsertOAuthUser,
} from './oauth';

passport.serializeUser((user, done) => {
  done(null, String((user as UserDocument)._id));
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

if (isGoogleConfigured()) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `${apiUrl()}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await upsertOAuthUser({
            provider: 'google',
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
          });
          done(null, user);
        } catch (err) {
          done(err as Error);
        }
      }
    )
  );
}

if (isFacebookConfigured()) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID as string,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        callbackURL: `${apiUrl()}/api/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'emails', 'name', 'picture.type(large)'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await upsertOAuthUser({
            provider: 'facebook',
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
          });
          done(null, user);
        } catch (err) {
          done(err as Error);
        }
      }
    )
  );
}

if (isGithubConfigured()) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        callbackURL: `${apiUrl()}/api/auth/github/callback`,
        scope: ['user:email'],
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: {
          id: string;
          displayName?: string;
          username?: string;
          emails?: Array<{ value: string }>;
          photos?: Array<{ value: string }>;
        },
        done: (err: Error | null, user?: UserDocument) => void
      ) => {
        try {
          const user = await upsertOAuthUser({
            provider: 'github',
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName || profile.username || 'GitHub user',
            avatar: profile.photos?.[0]?.value,
          });
          done(null, user);
        } catch (err) {
          done(err as Error);
        }
      }
    )
  );
}

export default passport;
