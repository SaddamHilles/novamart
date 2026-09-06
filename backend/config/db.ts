import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer: MongoMemoryServer | undefined;

export async function connectDB(uri?: string) {
  // One shared client for this long-running Express process.
  // Local single-node MongoDB and a first-project workload: mongoose
  // pool defaults are enough. We only fail fast, then fall back.
  mongoose.set('strictQuery', true);

  if (uri) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
      return { inMemory: false };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`Could not reach ${uri}: ${message}`);
      console.warn('Starting an in-memory MongoDB so you can still run the project locally.');
    }
  }

  memoryServer = await MongoMemoryServer.create();
  const memUri = memoryServer.getUri('novamart');
  await mongoose.connect(memUri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`In-memory MongoDB ready (${mongoose.connection.name})`);
  return { inMemory: true };
}
