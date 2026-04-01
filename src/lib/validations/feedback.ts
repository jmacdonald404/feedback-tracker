import { z } from "zod";

export const feedbackSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be at most 5000 characters"),
  category: z.enum(["BUG", "FEATURE", "IMPROVEMENT"], {
    message: "Please select a category",
  }),
  contactEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  // Honeypot field — should always be empty
  website: z.string().max(0).optional(),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;
