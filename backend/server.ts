import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { connectDB } from './config/db';
import passport from './config/passport';
import authRoutes from './routes/auth';
import socialRoutes from './routes/social';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import { notFound, errorHandler } from './middleware/error';
import { seedDatabase } from './data/seedDatabase';
import { clientOrigins } from './config/oauth';

const app = express();
const allowedOrigins = clientOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'novamart-session',
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: 'lax' },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'novamart-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/auth', socialRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;

connectDB(process.env.MONGO_URI)
  .then(async () => {
    await seedDatabase();
    app.listen(port, '0.0.0.0', () => {
      console.log(`API running on http://localhost:${port}`);
      console.log(`LAN API: http://192.168.100.2:${port}`);
    });
  })
  .catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error('MongoDB connection failed:', message);
    process.exit(1);
  });
