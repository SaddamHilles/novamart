import express from 'express';
import passport from '../config/passport';
import { signToken } from '../middleware/auth';
import {
  clientUrl,
  isFacebookConfigured,
  isGithubConfigured,
  isGoogleConfigured,
} from '../config/oauth';
import type { UserDocument } from '../models/User';

const router = express.Router();

function finishOAuth(req: express.Request, res: express.Response) {
  const user = req.user as UserDocument | undefined;
  if (!user) {
    res.redirect(`${clientUrl()}/login?error=${encodeURIComponent('Social sign-in failed.')}`);
    return;
  }
  const token = signToken(String(user._id));
  res.redirect(`${clientUrl()}/oauth/callback?token=${token}`);
}

router.get('/google', (req, res, next) => {
  if (!isGoogleConfigured()) {
    res.redirect(`${clientUrl()}/login?error=${encodeURIComponent('Google sign-in is not configured yet.')}`);
    return;
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${clientUrl()}/login?error=${encodeURIComponent('Google sign-in failed.')}`,
  }),
  finishOAuth
);

router.get('/facebook', (req, res, next) => {
  if (!isFacebookConfigured()) {
    res.redirect(`${clientUrl()}/login?error=${encodeURIComponent('Facebook sign-in is not configured yet.')}`);
    return;
  }
  passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
});

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: `${clientUrl()}/login?error=${encodeURIComponent('Facebook sign-in failed.')}`,
  }),
  finishOAuth
);

router.get('/github', (req, res, next) => {
  if (!isGithubConfigured()) {
    res.redirect(`${clientUrl()}/login?error=${encodeURIComponent('GitHub sign-in is not configured yet.')}`);
    return;
  }
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${clientUrl()}/login?error=${encodeURIComponent('GitHub sign-in failed.')}`,
  }),
  finishOAuth
);

export default router;
