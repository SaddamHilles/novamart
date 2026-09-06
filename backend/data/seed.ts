import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { seedDatabase } from './seedDatabase';

const shouldReset = process.argv.includes('--reset');

await connectDB(process.env.MONGO_URI);
await seedDatabase({ reset: shouldReset });
console.log('Admin  admin@novamart.dev / Admin123!');
console.log('Demo   demo@novamart.dev  / Demo123!');
await mongoose.disconnect();
