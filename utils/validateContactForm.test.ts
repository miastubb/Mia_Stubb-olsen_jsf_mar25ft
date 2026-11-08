import { describe, expect, it } from "vitest";
import {
  validateContactForm,
  type ContactFormValues,
} from "./validateContactForm";

const validValues: ContactFormValues = {
  fullName: "Ada",
  subject: "Hey",
  email: "ada@example.com",
  message: "Hello there!",
};

describe("validateContactForm", () => {
  it("accepts valid form values", () => {
    expect(validateContactForm(validValues)).toEqual({});
  });

  it("rejects empty required fields", () => {
    const errors = validateContactForm({
      fullName: "",
      subject: "",
      email: "",
      message: "",
    });

    expect(errors.fullName).toBeDefined();
    expect(errors.subject).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.message).toBeDefined();
  });

  it("rejects values below minimum lengths", () => {
    const errors = validateContactForm({
      ...validValues,
      fullName: "Ad",
      subject: "Hi",
      message: "Too short",
    });

    expect(errors.fullName).toBeDefined();
    expect(errors.subject).toBeDefined();
    expect(errors.message).toBeDefined();
  });

  it("accepts exact minimum lengths", () => {
    expect(
      validateContactForm({
        ...validValues,
        fullName: "Ada",
        subject: "Hey",
        message: "1234567890",
      }),
    ).toEqual({});
  });

  it("rejects invalid email addresses", () => {
    const errors = validateContactForm({
      ...validValues,
      email: "not-an-email",
    });

    expect(errors.email).toBeDefined();
  });

  it("rejects whitespace-only values", () => {
    const errors = validateContactForm({
      ...validValues,
      fullName: "   ",
      subject: "   ",
      message: "          ",
    });

    expect(errors.fullName).toBeDefined();
    expect(errors.subject).toBeDefined();
    expect(errors.message).toBeDefined();
  });
});
