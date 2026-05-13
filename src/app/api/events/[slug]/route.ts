import { eventRepo } from "@/server/repositories";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const event = await eventRepo.getBySlug(slug)

  if (event.length === 0) {
    return Response.json({ status: 404, message: "Event not found" })
  }

  return Response.json({
    status: 200,
    message: "Successfully fetched event",
    data: event
  })
}