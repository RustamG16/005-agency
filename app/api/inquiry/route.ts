import { NextResponse } from "next/server";
import { validateInquiry, type InquiryValues } from "@/components/sections/contact/inquiry";

export async function POST(request: Request) {
  let payload: InquiryValues;
  try {
    payload = (await request.json()) as InquiryValues;
  } catch {
    return NextResponse.json(
      { delivered: false, code: "INVALID_REQUEST", message: "The inquiry could not be read." },
      { status: 400 }
    );
  }

  if (payload.website) {
    return NextResponse.json({ delivered: false, code: "REJECTED" }, { status: 400 });
  }

  const errors = validateInquiry(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { delivered: false, code: "VALIDATION_ERROR", message: "Check the highlighted fields.", errors },
      { status: 422 }
    );
  }

  // Deliberately unconfigured: a user-approved server-side transport will replace this.
  // A success response must only follow provider-confirmed delivery.
  return NextResponse.json(
    {
      delivered: false,
      code: "DELIVERY_NOT_CONFIGURED",
      message: "Online delivery is not configured yet. Please use the fallback email.",
    },
    { status: 503 }
  );
}
