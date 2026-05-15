import { auth } from "@/lib/auth";
import { paymentRepo, reservationRepo, userRepo } from "@/server/repositories";
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

export async function GET(request: NextRequest) {
  const gate = await assertAdmin(request);
  if (!gate.ok) {
    return Response.json(
      { status: gate.status, message: gate.message, data: null },
      { status: gate.status },
    );
  }

  const [totalEarningsIDR, reservations] = await Promise.all([
    paymentRepo.getTotalSuccessfulAmountIDR(),
    reservationRepo.getAllWithUserEvent(),
  ]);

  return Response.json({
    status: 200,
    message: "Successfully fetched earnings",
    data: {
      totalEarningsIDR,
      reservations,
    },
  });
}
