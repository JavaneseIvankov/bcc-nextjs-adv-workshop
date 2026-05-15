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
  return { ok: true as const, session };
}

type Body = {
  title?: string;
  slug?: string;
  description?: string;
  date?: string;
  location?: string;
  imageUrl?: string;
  priceIDR?: string | number;
};

export async function POST(request: NextRequest) {
  const gate = await assertAdmin(request);
  if (!gate.ok) {
    return Response.json(
      { status: gate.status, message: gate.message, data: null },
      { status: gate.status },
    );
  }

  const body = (await request.json()) as Body;
  const priceIDR = Number(body.priceIDR);
  if (
    !body.title ||
    !body.slug ||
    !body.description ||
    !body.date ||
    !body.location ||
    !body.imageUrl ||
    !Number.isFinite(priceIDR) ||
    priceIDR < 0
  ) {
    return Response.json(
      { status: 400, message: "Invalid event payload", data: null },
      { status: 400 },
    );
  }

  const existing = await eventRepo.getBySlug(body.slug);
  if (existing) {
    return Response.json(
      { status: 409, message: "Slug already exists", data: null },
      { status: 409 },
    );
  }

  const created = await eventRepo.create({
    title: body.title,
    slug: body.slug,
    description: body.description,
    date: body.date,
    location: body.location,
    imageUrl: body.imageUrl,
    priceIDR,
  });

  revalidateTag("events", "max");

  return Response.json({
    status: 200,
    message: "Event created",
    data: created,
  });
}
