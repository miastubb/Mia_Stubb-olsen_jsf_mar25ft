export interface ContactFormValues {
  fullName: string;
  subject: string;
  email: string;
  message: string;
}

export type ContactFormErrors = Partial<
  Record<keyof ContactFormValues, string>
>;

export function validateContactForm(
  values: ContactFormValues,
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  const fullName = values.fullName.trim();
  const subject = values.subject.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!fullName) {
    errors.fullName = "please enter your full name";
  } else if (fullName.length < 3) {
    errors.fullName = "full name must be at least 3 characters long";
  }

  if (!subject) {
    errors.subject = "please enter a subject";
  } else if (subject.length < 3) {
    errors.subject = "subject must be at least 3 characters long";
  }

  if (!email) {
    errors.email = "please enter your email address";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "please enter a valid email address";
  }

  if (!message) {
    errors.message = "please enter a message";
  } else if (message.length < 10) {
    errors.message = "message must be at least 10 characters long";
  }

  return errors;
}
