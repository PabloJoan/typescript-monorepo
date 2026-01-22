import { z } from "zod";
import { feedbacks } from "../../db/schema";
import { db } from "../../db";
import { deleteFeedbackSchema } from "@repo/shared";
import { eq } from "drizzle-orm";

type Input = { input: z.Infer<typeof deleteFeedbackSchema> };

export async function deleteFeedback({ input }: Input) {
  return await db
    .delete(feedbacks)
    .where(eq(feedbacks.id, input.id))
    .returning();
}
