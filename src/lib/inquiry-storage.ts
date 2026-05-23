/**
 * Inquiry persistence — behind a narrow interface so the backend can be
 * swapped (Resend / Postmark / Supabase) without touching the API route.
 *
 * To swap: implement `InquiryStore` and change `getInquiryStore()`.
 */
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { InquiryRecord } from "./inquiry-schema";

export interface InquiryStore {
  save(record: InquiryRecord): Promise<void>;
}

/** Default: append-only JSON file in /data. Good enough for launch. */
class JsonFileStore implements InquiryStore {
  private readonly dir = path.join(process.cwd(), "data");
  private readonly file = path.join(this.dir, "inquiries.json");

  async save(record: InquiryRecord): Promise<void> {
    await mkdir(this.dir, { recursive: true });
    let existing: InquiryRecord[] = [];
    try {
      existing = JSON.parse(await readFile(this.file, "utf8"));
      if (!Array.isArray(existing)) existing = [];
    } catch {
      /* first write — file does not exist yet */
    }
    existing.push(record);
    await writeFile(
      this.file,
      JSON.stringify(existing, null, 2) + "\n",
      "utf8",
    );
  }
}

let store: InquiryStore | null = null;
export function getInquiryStore(): InquiryStore {
  if (!store) store = new JsonFileStore();
  return store;
}

/** Build a persistable record from validated input + request metadata. */
export function buildInquiryRecord(
  input: {
    fullName: string;
    company: string;
    role: string;
    website?: string;
    email: string;
  },
  meta: { ip: string; userAgent: string },
): InquiryRecord {
  return {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    fullName: input.fullName,
    company: input.company,
    role: input.role,
    website: input.website ?? "",
    email: input.email,
    // Hash the IP — we want abuse signal, not PII at rest.
    ipHash: createHash("sha256")
      .update(meta.ip + (process.env.IP_HASH_SALT ?? "vc-salt"))
      .digest("hex")
      .slice(0, 16),
    userAgent: meta.userAgent.slice(0, 256),
  };
}
