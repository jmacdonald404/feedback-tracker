import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Create regular users
  const user1 = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      name: "Alice",
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      name: "Bob",
      role: "USER",
    },
  });

  // Create tags
  const tagUI = await prisma.tag.upsert({
    where: { name: "ui" },
    update: {},
    create: { name: "ui" },
  });

  const tagPerf = await prisma.tag.upsert({
    where: { name: "performance" },
    update: {},
    create: { name: "performance" },
  });

  // Create feedback posts
  const post1 = await prisma.feedbackPost.create({
    data: {
      title: "Dark mode support",
      description:
        "It would be great to have a dark mode option. The current light theme is hard on the eyes during nighttime use. Many modern applications provide this as a standard feature.",
      category: "FEATURE",
      status: "PLANNED",
      isPublished: true,
      voteCount: 12,
      authorId: user1.id,
      tags: { connect: [{ id: tagUI.id }] },
    },
  });

  const post2 = await prisma.feedbackPost.create({
    data: {
      title: "Page loads slowly on mobile",
      description:
        "The dashboard takes 5+ seconds to load on my phone (iPhone 14, Safari). This makes the app nearly unusable on mobile. Please optimize the initial load time.",
      category: "BUG",
      status: "IN_PROGRESS",
      isPublished: true,
      voteCount: 8,
      authorId: user2.id,
      assigneeId: admin.id,
      tags: { connect: [{ id: tagPerf.id }] },
    },
  });

  const post3 = await prisma.feedbackPost.create({
    data: {
      title: "Export feedback data to CSV",
      description:
        "As an admin, I want to export all feedback data to a CSV file for reporting and analysis purposes. This should include all fields and be filterable by date range.",
      category: "FEATURE",
      status: "NEW",
      isPublished: true,
      voteCount: 5,
      authorId: user1.id,
    },
  });

  await prisma.feedbackPost.create({
    data: {
      title: "Improve error messages on form validation",
      description:
        "The error messages when submitting feedback are too generic. They should be more specific about what field failed validation and why.",
      category: "IMPROVEMENT",
      status: "UNDER_REVIEW",
      isPublished: true,
      voteCount: 3,
      authorId: user2.id,
      tags: { connect: [{ id: tagUI.id }] },
    },
  });

  // Unpublished post (pending review)
  await prisma.feedbackPost.create({
    data: {
      title: "Add SSO login with SAML",
      description:
        "Our organization uses SAML-based SSO. Please add support for SAML authentication so we can integrate with our identity provider.",
      category: "FEATURE",
      status: "NEW",
      isPublished: false,
      contactEmail: "enterprise@example.com",
    },
  });

  // Add some comments
  await prisma.comment.create({
    data: {
      content: "Yes please! I use this app at night all the time.",
      postId: post1.id,
      authorId: user2.id,
      isStaffReply: false,
    },
  });

  await prisma.comment.create({
    data: {
      content:
        "We are planning to ship dark mode in the next release. Thanks for the feedback!",
      postId: post1.id,
      authorId: admin.id,
      isStaffReply: true,
    },
  });

  await prisma.comment.create({
    data: {
      content:
        "We have identified the issue — it is related to unoptimized images. A fix is in progress.",
      postId: post2.id,
      authorId: admin.id,
      isStaffReply: true,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Would be great to also support PDF export in addition to CSV.",
      postId: post3.id,
      authorId: user1.id,
      isStaffReply: false,
    },
  });

  console.log("Seed data created successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
