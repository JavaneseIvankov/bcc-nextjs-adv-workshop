import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db/db"
import { env } from "./env.server"
import * as schema from "@/lib/db/schema"

export const auth = betterAuth({
   database: drizzleAdapter(db, {
   provider: "pg",
   schema: schema,
   }),
   baseURL: env.BETTER_AUTH_URL,
   user: {
      additionalFields: {
         role: {
            type: ["admin", "user"],
            required: false,
            defaultValue: "user",
            input: false,
         },
      },
   },
   emailAndPassword: {
      enabled: true,
   },
   socialProviders: {
      github: {
         clientId: env.GITHUB_CLIENT_ID,
         clientSecret: env.GITHUB_CLIENT_SECRET,
         scope: ["read:user", "user:email"],
      }
   },
   session: {
      cookieCache: {
         enabled: true,
         maxAge: 5 * 60
      }
   }
})
