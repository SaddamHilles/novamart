import express from 'express';
import { User, type UserDocument } from '../models/User';
import { asyncHandler } from '../middleware/error';
import { protect, requireUser, signToken } from '../middleware/auth';
import { uploadAvatar } from '../config/upload';

const router = express.Router();

export function publicUser(user: UserDocument) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    avatar: user.avatar || '',
  };
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: 'An account with this email already exists' });
      return;
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ token: signToken(String(user._id)), user: publicUser(user) });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    if (!user.password) {
      res.status(401).json({
        message: 'This account uses Google, Facebook, or GitHub. Sign in with that provider.',
      });
      return;
    }
    if (!password || !(await user.matchPassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.json({ token: signToken(String(user._id)), user: publicUser(user) });
  })
);

router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    res.json({ user: publicUser(requireUser(req)) });
  })
);

router.put(
  '/profile',
  protect,
  uploadAvatar.single('avatar'),
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const { name } = req.body as { name?: string };
    if (name?.trim()) {
      user.name = name.trim();
    }
    if (req.file) {
      user.avatar = `/uploads/avatars/${req.file.filename}`;
      user.avatarSource = 'upload';
    }
    await user.save();
    res.json({ user: publicUser(user) });
  })
);

export default router;
