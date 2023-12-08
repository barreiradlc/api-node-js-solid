import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

const { success } = _env;

if (success === false) {
  console.error("Invalid env variables", _env.error.format());

  throw new Error("Invalid env variables");
}

export const env = _env.data;
