"use server";

import { prisma } from "@/lib/prisma";

export type SortOption = "votes" | "newest" | "oldest" | "updated";
export type CategoryFilter = "BUG" | "FEATURE" | "IMPROVEMENT" | "ALL";
export type StatusFilter =
  | "NEW"
  | "UNDER_REVIEW"
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DECLINED"
  | "ALL";

const PAGE_SIZE = 20;

interface FetchFeedbackParams {
  page?: number;
  sort?: SortOption;
  category?: CategoryFilter;
  status?: StatusFilter;
  search?: string;
}

export async function fetchPublishedFeedback({
  page = 1,
  sort = "newest",
  category = "ALL",
  status = "ALL",
  search = "",
}: FetchFeedbackParams = {}) {
  const where: Record<string, unknown> = { isPublished: true };

  if (category !== "ALL") {
    where.category = category;
  }
  if (status !== "ALL") {
    where.status = status;
  }
  if (search.trim()) {
    where.OR = [
      { title: { contains: search.trim(), mode: "insensitive" } },
      { description: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  const orderBy = (() => {
    switch (sort) {
      case "votes":
        return { voteCount: "desc" as const };
      case "oldest":
        return { createdAt: "asc" as const };
      case "updated":
        return { updatedAt: "desc" as const };
      case "newest":
      default:
        return { createdAt: "desc" as const };
    }
  })();

  const [posts, total] = await Promise.all([
    prisma.feedbackPost.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        voteCount: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { name: true, image: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.feedbackPost.count({ where }),
  ]);

  return {
    posts,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export async function fetchFeedbackById(id: string) {
  return prisma.feedbackPost.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      assignee: { select: { id: true, name: true, image: true } },
      tags: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
      },
      _count: { select: { votes: true, comments: true } },
    },
  });
}

export type FeedbackListItem = Awaited<
  ReturnType<typeof fetchPublishedFeedback>
>["posts"][number];

export type FeedbackDetail = NonNullable<
  Awaited<ReturnType<typeof fetchFeedbackById>>
>;
