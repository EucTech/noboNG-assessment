import { describe, expect, it } from "vitest";

import { checkoutSchema } from "./checkout.schema";

const VALID = {
  name: "Uche Ezeibe",
  email: "uche@example.com",
  phone: "+2348012345678",
  addressLine: "12 Adeola Odeku Street, Victoria Island",
  city: "Lagos",
  state: "Lagos",
};

function fieldErrors(input: Record<string, unknown>): string[] {
  const result = checkoutSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => String(issue.path[0]));
}

describe("checkoutSchema", () => {
  it("accepts a complete Nigerian delivery address", () => {
    const result = checkoutSchema.safeParse(VALID);

    expect(result.success).toBe(true);
  });

  it("normalises the email to lower case", () => {
    const result = checkoutSchema.parse({ ...VALID, email: "  Uche@Example.COM " });

    expect(result.email).toBe("uche@example.com");
  });

  it("strips spaces and dashes from the phone number", () => {
    const result = checkoutSchema.parse({ ...VALID, phone: "0801 234-5678" });

    expect(result.phone).toBe("08012345678");
  });

  it.each([
    ["+2348012345678"],
    ["2348012345678"],
    ["08012345678"],
    ["07012345678"],
    ["09012345678"],
    ["08112345678"],
  ])("accepts the Nigerian phone format %s", (phone) => {
    expect(checkoutSchema.safeParse({ ...VALID, phone }).success).toBe(true);
  });

  it.each([["12345"], ["+1 415 555 0100"], ["0601234567"], ["080123456"]])(
    "rejects the invalid phone number %s",
    (phone) => {
      expect(fieldErrors({ ...VALID, phone })).toContain("phone");
    },
  );

  it("rejects a name that is too short", () => {
    expect(fieldErrors({ ...VALID, name: "U" })).toContain("name");
  });

  it("rejects a malformed email", () => {
    expect(fieldErrors({ ...VALID, email: "not-an-email" })).toContain("email");
  });

  it("rejects an empty address", () => {
    expect(fieldErrors({ ...VALID, addressLine: "" })).toContain("addressLine");
  });

  it("rejects a state outside Nigeria", () => {
    expect(fieldErrors({ ...VALID, state: "California" })).toContain("state");
  });

  it("reports every invalid field at once", () => {
    const errors = fieldErrors({
      name: "U",
      email: "nope",
      phone: "123",
      addressLine: "x",
      city: "L",
      state: "Lagos",
    });

    expect(errors).toEqual(
      expect.arrayContaining(["name", "email", "phone", "addressLine", "city"]),
    );
  });
});
