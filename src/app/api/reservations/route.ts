import { auth } from "@/lib/auth"
import { reservationRepo } from "@/server/repositories"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
   const session = await auth.api.getSession({
      headers: request.headers
   })

   if (!session) {
      return Response.json({
         status: 401,
         message: "You are not authorized to perform this action",
         data: null
      }, { status: 401 })
   }

   const reservations = await reservationRepo.getOwnedDetailed(session.user.id)
   return Response.json({
      status: 200,
      message: "Successfully fetched reservations",
      data: reservations
   })
}
