import { z } from "zod";

export const helloSchema = z.object({ name: z.string().optional() });

export const createFeedbackSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const upvoteFeedbackSchema = z.object({ id: z.string() });

export const deleteFeedbackSchema = z.object({ id: z.string() });

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
