"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

// ─── Feedback Management ─────────────────────────────

export async function updateFeedbackStatus(id: string, status: string) {
  await requireAdmin();
  await prisma.feedbackPost.update({ where: { id }, data: { status: status as never } });
  revalidatePath("/admin/feedback");
  revalidatePath(`/admin/feedback/${id}`);
  revalidatePath(`/feedback/${id}`);
  revalidatePath("/feedback");
}

export async function assignFeedback(id: string, assigneeId: string | null) {
  await requireAdmin();
  await prisma.feedbackPost.update({
    where: { id },
    data: { assigneeId },
  });
  revalidatePath("/admin/feedback");
  revalidatePath(`/admin/feedback/${id}`);
  revalidatePath(`/feedback/${id}`);
}

export async function togglePublish(id: string) {
  await requireAdmin();
  const post = await prisma.feedbackPost.findUnique({ where: { id }, select: { isPublished: true } });
  if (!post) throw new Error("Post not found");

  await prisma.feedbackPost.update({
    where: { id },
    data: { isPublished: !post.isPublished },
  });
  revalidatePath("/admin/feedback");
  revalidatePath(`/admin/feedback/${id}`);
  revalidatePath("/feedback");
}

export async function updateFeedback(
  id: string,
  data: { title?: string; description?: string; category?: string }
) {
  await requireAdmin();
  await prisma.feedbackPost.update({
    where: { id },
    data: data as never,
  });
  revalidatePath("/admin/feedback");
  revalidatePath(`/admin/feedback/${id}`);
  revalidatePath(`/feedback/${id}`);
}

export async function mergeFeedback(sourceId: string, targetId: string) {
  await requireAdmin();
  if (sourceId === targetId) throw new Error("Cannot merge into itself");

  await prisma.$transaction(async (tx) => {
    // Move votes (skip duplicates)
    const sourceVotes = await tx.vote.findMany({ where: { postId: sourceId } });
    const targetVotes = await tx.vote.findMany({ where: { postId: targetId } });
    const targetVoterIds = new Set(targetVotes.map((v) => v.userId));

    for (const vote of sourceVotes) {
      if (!targetVoterIds.has(vote.userId)) {
        await tx.vote.update({ where: { id: vote.id }, data: { postId: targetId } });
      } else {
        await tx.vote.delete({ where: { id: vote.id } });
      }
    }

    // Move comments
    await tx.comment.updateMany({
      where: { postId: sourceId },
      data: { postId: targetId },
    });

    // Recalculate vote count on target
    const newVoteCount = await tx.vote.count({ where: { postId: targetId } });
    await tx.feedbackPost.update({
      where: { id: targetId },
      data: { voteCount: newVoteCount },
    });

    // Mark source as merged
    await tx.feedbackPost.update({
      where: { id: sourceId },
      data: {
        mergedIntoId: targetId,
        isPublished: false,
        voteCount: 0,
      },
    });
  });

  revalidatePath("/admin/feedback");
  revalidatePath("/feedback");
}

export async function manageTags(postId: string, tagNames: string[]) {
  await requireAdmin();

  // Disconnect all existing tags, then connect/create new ones
  await prisma.feedbackPost.update({
    where: { id: postId },
    data: {
      tags: {
        set: [], // disconnect all
        connectOrCreate: tagNames.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });

  revalidatePath(`/admin/feedback/${postId}`);
  revalidatePath(`/feedback/${postId}`);
}

// ─── User Management ─────────────────────────────────

export async function setUserRole(userId: string, role: "USER" | "ADMIN") {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

// ─── Stats / Queries ─────────────────────────────────

export async function getAdminStats() {
  await requireAdmin();

  const [total, byStatus, byCategory, unreviewed, thisWeek] =
    await Promise.all([
      prisma.feedbackPost.count(),
      prisma.feedbackPost.groupBy({ by: ["status"], _count: true }),
      prisma.feedbackPost.groupBy({ by: ["category"], _count: true }),
      prisma.feedbackPost.count({ where: { status: "NEW" } }),
      prisma.feedbackPost.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

  return { total, byStatus, byCategory, unreviewed, thisWeek };
}

export async function getAllFeedback(params: {
  page?: number;
  status?: string;
  category?: string;
  published?: string;
}) {
  await requireAdmin();
  const pageSize = 25;
  const page = Math.max(1, params.page ?? 1);

  const where: Record<string, unknown> = {};
  if (params.status && params.status !== "ALL") where.status = params.status;
  if (params.category && params.category !== "ALL") where.category = params.category;
  if (params.published === "true") where.isPublished = true;
  if (params.published === "false") where.isPublished = false;

  const [posts, total] = await Promise.all([
    prisma.feedbackPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: { select: { name: true, image: true } },
        assignee: { select: { name: true } },
        _count: { select: { comments: true, votes: true } },
      },
    }),
    prisma.feedbackPost.count({ where }),
  ]);

  return { posts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getAdminUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: { select: { posts: true, comments: true } },
    },
  });
}

export async function getAdminFeedbackDetail(id: string) {
  await requireAdmin();
  return prisma.feedbackPost.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      assignee: { select: { id: true, name: true, image: true } },
      tags: true,
      mergedInto: { select: { id: true, title: true } },
      mergedPosts: { select: { id: true, title: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, name: true, image: true } } },
      },
      _count: { select: { votes: true, comments: true } },
    },
  });
}

export async function getAdminStaff() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, name: true, image: true },
  });
}
