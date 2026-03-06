import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("*"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters")
});

export const env = envSchema.parse(process.env);
