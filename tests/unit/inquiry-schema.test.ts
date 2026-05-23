import { describe, expect, it } from "vitest";
import { inquirySchema } from "@/lib/inquiry-schema";

const valid = {
  fullName: "Jane Founder",
  company: "Acme Inc.",
  role: "Co-founder & CEO",
  website: "https://acme.com",
  email: "jane@acme.com",
  fax: "",
  humanCheck: "5",
};

describe("inquirySchema", () => {
  it("accepts a well-formed inquiry", () => {
    expect(inquirySchema.safeParse(valid).success).toBe(true);
  });

  it("treats website as optional", () => {
    const r = inquirySchema.safeParse({ ...valid, website: "" });
    expect(r.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const r = inquirySchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects an invalid website URL", () => {
    const r = inquirySchema.safeParse({ ...valid, website: "acme" });
    expect(r.success).toBe(false);
  });

  it("rejects a too-short name", () => {
    const r = inquirySchema.safeParse({ ...valid, fullName: "J" });
    expect(r.success).toBe(false);
  });

  it("rejects a wrong cognitive-check answer", () => {
    const r = inquirySchema.safeParse({ ...valid, humanCheck: "4" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0].path).toContain("humanCheck");
    }
  });

  it("trims whitespace from text fields", () => {
    const r = inquirySchema.safeParse({ ...valid, fullName: "  Jane  " });
    expect(r.success && r.data.fullName).toBe("Jane");
  });
});
