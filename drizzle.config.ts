import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "pg",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
