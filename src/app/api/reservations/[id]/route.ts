
import { auth } from "@/lib/auth"
import { reservationRepo } from "@/server/repositories"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   const { id } = await params
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

   const reservations = await reservationRepo.getById(id)

   if (reservations.length === 0) {
      return Response.json({
         status: 404,
         message: "Reservation not found",
         data: null
      })
   }

   if (reservations[0].userId !== session.user.id) {
      return Response.json({
         status: 403,
         message: "You are not authorized to perform this action",
         data: null
      })
   }

   return Response.json({
      status: 200,
      message: "Successfully fetched reservation",
      data: reservations[0]
   })
}