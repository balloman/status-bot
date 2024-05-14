import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

const connectionString = process.env.CONNECTION_STRING;
if (!connectionString) {
  throw new Error("CONNECTION_STRING is not set");
}

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
