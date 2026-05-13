import { auth } from "@/lib/auth"
import { reservationRepo } from "@/server/repositories"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
   const session = await auth.api.getSession({
      headers: await request.headers
   })

   if (!session) {
      return Response.json({
         status: 401,
         message: "You are not authorized to perform this action",
         data: null
      })
   }

   const reservations = await reservationRepo.getOwned(session.user.id)
   return Response.json({
      status: 200,
      message: "Successfully fetched reservations",
      data: reservations
   })
}