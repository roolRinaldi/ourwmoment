import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const STORAGE_BUCKET = "wedding-moments";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_IMAGE_BYTES + 1024 * 1024;
const PNG_WIDTH = 1080;
const PNG_HEIGHT = 1920;
const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

function errorResponse(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function isFinalMomentPng(bytes: Uint8Array) {
  if (bytes.length < 24) return false;
  if (!PNG_SIGNATURE.every((value, index) => bytes[index] === value)) return false;

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getUint32(16) === PNG_WIDTH && view.getUint32(20) === PNG_HEIGHT;
}

function logServerError(context: string, error: unknown) {
  if (process.env.NODE_ENV === "production") return;
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[moments] ${context}: ${message}`);
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return errorResponse("The final image is too large.", 413);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse("The submission could not be read.", 400);
  }

  const guestNameValue = formData.get("guestName");
  const messageValue = formData.get("message");
  const imageValue = formData.get("image");
  const guestName = typeof guestNameValue === "string" ? guestNameValue.trim() : "";
  const message = typeof messageValue === "string" ? messageValue.trim() : "";

  if (!guestName) return errorResponse("Guest name is required.", 400);
  if (!message) return errorResponse("Message is required.", 400);
  if (message.length > 300) return errorResponse("Message must be 300 characters or fewer.", 400);
  if (!(imageValue instanceof File)) return errorResponse("The final PNG is required.", 400);
  if (imageValue.type !== "image/png") return errorResponse("The final image must be a PNG.", 415);
  if (!imageValue.size) return errorResponse("The final PNG is empty.", 400);
  if (imageValue.size > MAX_IMAGE_BYTES) return errorResponse("The final image is too large.", 413);

  const imageBytes = new Uint8Array(await imageValue.arrayBuffer());
  if (!isFinalMomentPng(imageBytes)) {
    return errorResponse("The final image has invalid dimensions or content.", 422);
  }

  const imagePath = `moments/${randomUUID()}.png`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(imagePath, imageBytes, {
      cacheControl: "3600",
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    logServerError("storage upload failed", uploadError);
    return errorResponse("Your moment could not be sent. Please try again.", 500);
  }

  const { data: moment, error: insertError } = await supabaseAdmin
    .from("moments")
    .insert({ guest_name: guestName, message, image_path: imagePath })
    .select("id")
    .single();

  if (insertError || !moment) {
    logServerError("database insert failed", insertError);
    const { error: cleanupError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([imagePath]);
    if (cleanupError) logServerError("storage rollback failed", cleanupError);
    return errorResponse("Your moment could not be sent. Please try again.", 500);
  }

  return NextResponse.json({ ok: true, momentId: moment.id }, { status: 201 });
}
