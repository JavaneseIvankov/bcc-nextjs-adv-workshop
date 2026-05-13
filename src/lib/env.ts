import { z } from "zod"
import "dotenv/config"

const envSchema = z.object({
   DATABASE_URL: z.string(), 
   GITHUB_CLIENT_ID: z.string(),
   GITHUB_CLIENT_SECRET: z.string(),
   BETTER_AUTH_URL: z.string().default("http://localhost:3000"),
   BETTER_AUTH_SECRET: z.string(),
   NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
   MIDTRANS_SERVER_KEY: z.string(),
   MIDTRANS_CLIENT_KEY: z.string(),
   MIDTRANS_IS_PRODUCTION: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
})

export const env = envSchema.parse(process.env)
