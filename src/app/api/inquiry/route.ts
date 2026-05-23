import { NextResponse, type NextRequest } from "next/server";
import { inquirySchema } from "@/lib/inquiry-schema";
import { buildInquiryRecord, getInquiryStore } from "@/lib/inquiry-storage";

// Filesystem writes — never statically optimised.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/inquiry — validate, screen for spam, persist.
 *
 * Returns `{ ok: true }` on success or `{ ok: false, errors }` with
 * field-level messages on validation failure. Honeypot hits are
 * answered with a success shape so bots get no signal.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { _form: "Malformed request." } },
      { status: 400 },
    );
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "_form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  // Honeypot tripped — accept silently, persist nothing.
  if (parsed.data.fax && parsed.data.fax.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "0.0.0.0";

  try {
    const record = buildInquiryRecord(parsed.data, {
      ip,
      userAgent: request.headers.get("user-agent") ?? "unknown",
    });
    await getInquiryStore().save(record);
  } catch {
    return NextResponse.json(
      { ok: false, errors: { _form: "Could not save your note. Try again." } },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
