import { auth } from "@/lib/auth";
import { eventRepo, userRepo } from "@/server/repositories";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

async function assertAdmin(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }
  const role = await userRepo.getRoleById(session.user.id);
  if (role !== "admin") {
    return { ok: false as const, status: 403, message: "Forbidden" };
  }
  return { ok: true as const };
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await assertAdmin(request);
  if (!gate.ok) {
    return Response.json(
      { status: gate.status, message: gate.message, data: null },
      { status: gate.status },
    );
  }

  const { id } = await params;
  const removed = await eventRepo.removeById(id);
  if (!removed) {
    return Response.json(
      { status: 404, message: "Event not found", data: null },
      { status: 404 },
    );
  }

  revalidateTag("events", "max");

  return Response.json({
    status: 200,
    message: "Event removed",
    data: removed,
  });
}
