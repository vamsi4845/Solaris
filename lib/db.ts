import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

// Get connection string from environment variable
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

// Create postgres connection
const client = postgres(connectionString);

// Create drizzle database instance
export const db = drizzle(client); 