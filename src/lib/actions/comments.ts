"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be at most 2000 characters"),
});

export type CommentResult =
  | { success: true }
  | { success: false; error: string };

export async function createComment(
  postId: string,
  formData: FormData
): Promise<CommentResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to comment." };
  }

  const parsed = commentSchema.safeParse({
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid comment",
    };
  }

  // Strip HTML tags for safety
  const sanitized = parsed.data.content.replace(/<[^>]*>/g, "");

  const isAdmin = session.user.role === "ADMIN";

  await prisma.comment.create({
    data: {
      content: sanitized,
      postId,
      authorId: session.user.id,
      isStaffReply: isAdmin,
    },
  });

  revalidatePath(`/feedback/${postId}`);
  return { success: true };
}
