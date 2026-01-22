import { z } from "zod";
import { feedbacks } from "../../db/schema";
import { db } from "../../db";
import { upvoteFeedbackSchema } from "@repo/shared";
import { eq, sql } from "drizzle-orm";

type Input = { input: z.Infer<typeof upvoteFeedbackSchema> };

export async function upvoteFeedback({ input }: Input) {
  return await db
    .update(feedbacks)
    .set({ upvotes: sql`${feedbacks.upvotes} + 1` })
    .where(eq(feedbacks.id, input.id))
    .returning();
}
