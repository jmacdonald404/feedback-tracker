"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type VoteResult =
  | { success: true; voted: boolean; voteCount: number }
  | { success: false; error: string };

export async function toggleVote(postId: string): Promise<VoteResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to vote." };
  }

  const userId = session.user.id;

  const existing = await prisma.vote.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    // Remove vote
    await prisma.$transaction([
      prisma.vote.delete({ where: { id: existing.id } }),
      prisma.feedbackPost.update({
        where: { id: postId },
        data: { voteCount: { decrement: 1 } },
      }),
    ]);
    const post = await prisma.feedbackPost.findUnique({
      where: { id: postId },
      select: { voteCount: true },
    });
    revalidatePath("/feedback");
    revalidatePath(`/feedback/${postId}`);
    return { success: true, voted: false, voteCount: post?.voteCount ?? 0 };
  } else {
    // Add vote
    await prisma.$transaction([
      prisma.vote.create({ data: { postId, userId } }),
      prisma.feedbackPost.update({
        where: { id: postId },
        data: { voteCount: { increment: 1 } },
      }),
    ]);
    const post = await prisma.feedbackPost.findUnique({
      where: { id: postId },
      select: { voteCount: true },
    });
    revalidatePath("/feedback");
    revalidatePath(`/feedback/${postId}`);
    return { success: true, voted: true, voteCount: post?.voteCount ?? 0 };
  }
}

export async function getUserVotes(
  postIds: string[]
): Promise<Set<string>> {
  const session = await auth();
  if (!session?.user?.id || postIds.length === 0) return new Set();

  const votes = await prisma.vote.findMany({
    where: {
      userId: session.user.id,
      postId: { in: postIds },
    },
    select: { postId: true },
  });

  return new Set(votes.map((v) => v.postId));
}
