import { z } from "zod";
import { feedbacks } from "../../db/schema";
import { db } from "../../db";
import { createFeedbackSchema } from "@repo/shared";

type Input = { input: z.Infer<typeof createFeedbackSchema> };

export async function createFeedback({ input }: Input) {
  return await db.insert(feedbacks).values(input).returning();
}
