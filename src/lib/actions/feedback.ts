"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { feedbackSchema } from "@/lib/validations/feedback";
import { headers } from "next/headers";

// Simple in-memory rate limiting (resets on cold start, fine for serverless)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export type SubmitFeedbackResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function submitFeedback(
  formData: FormData
): Promise<SubmitFeedbackResult> {
  // Rate limit by IP
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return {
      success: false,
      error: "Too many submissions. Please try again later.",
    };
  }

  // Parse form data
  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    contactEmail: formData.get("contactEmail"),
    website: formData.get("website"), // honeypot
  };

  const parsed = feedbackSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError?.message ?? "Invalid form data",
    };
  }

  // Honeypot check — bots fill hidden fields
  if (parsed.data.website && parsed.data.website.length > 0) {
    // Silently accept but don't save (don't tip off bots)
    return { success: true, id: "ok" };
  }

  // Check if user is authenticated
  const session = await auth();
  const authorId = session?.user?.id ?? null;

  // Create the feedback post
  const post = await prisma.feedbackPost.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      contactEmail: parsed.data.contactEmail || null,
      authorId,
      isPublished: false,
      status: "NEW",
    },
  });

  return { success: true, id: post.id };
}
