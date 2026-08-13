export type InquiryValues = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  consent: boolean;
  website: string;
};

export type InquiryErrors = Partial<Record<keyof InquiryValues, string>>;

export const initialInquiryValues: InquiryValues = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  message: "",
  consent: false,
  website: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInquiry(values: InquiryValues): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  else if (values.name.trim().length > 120) errors.name = "Keep your name under 120 characters.";
  if (!values.email.trim()) errors.email = "Enter your email.";
  else if (!emailPattern.test(values.email)) errors.email = "Enter a valid email address.";
  else if (values.email.length > 254) errors.email = "Keep your email under 254 characters.";
  if (!values.projectType) errors.projectType = "Select a project type.";
  if (!values.message.trim()) errors.message = "Tell us a little about the project.";
  else if (values.message.trim().length < 20) errors.message = "Add a little more detail (at least 20 characters).";
  else if (values.message.length > 5000) errors.message = "Keep your message under 5,000 characters.";
  if (values.company.length > 160) errors.company = "Keep the company name under 160 characters.";
  if (!values.consent) errors.consent = "Consent is required to send this inquiry.";
  return errors;
}
