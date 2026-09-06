import fs from 'fs';
import path from 'path';
import multer from 'multer';
import type { Request } from 'express';

export const avatarDir = path.join(process.cwd(), 'uploads', 'avatars');
fs.mkdirSync(avatarDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, avatarDir),
  filename: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
    cb(null, `${req.user?._id || 'user'}-${Date.now()}${safeExt}`);
  },
});

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      cb(new Error('Please choose a JPG, PNG, WebP, or GIF image'));
      return;
    }
    cb(null, true);
  },
});
