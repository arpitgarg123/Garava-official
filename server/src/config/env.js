// src/config/env.js
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().max(65535).default(3000),

  // CLIENT_URL: z.string().url().optional().or(z.literal("*")),

  MONGO_URI: z.string().url({
    message: "MONGO_URI must be a valid mongodb connection string",
  }),

  // JWT_SECRET: z
  //   .string()
  //   .min(16, "JWT_SECRET must be at least 16 characters for security"),
});

// Parse & validate
const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  // Pretty print all issues and exit
  console.error("❌ Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

// Export a nice, safe object
export const env = parsed.data;
 