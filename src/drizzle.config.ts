import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

interface CustomConfig {
  schema: string;
  out: string;
  dialect: "postgresql" | "mysql" | "sqlite";
  connection?: {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
  };
}

export default defineConfig({
  dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
  schema: "./src/db/schema",
  out: "./src/drizzle/migrations",
  dbCredentials: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
} as CustomConfig);
