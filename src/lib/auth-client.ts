import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "@/lib/auth"
import { env } from "./env.client";

export const authClient = createAuthClient({
   baseURL: env.NEXT_PUBLIC_APP_URL,
   plugins: [inferAdditionalFields<typeof auth>()],
})

export const { useSession } = authClient;
