import { feedbacks } from "../../db/schema";
import { db } from "../../db";
import { desc } from "drizzle-orm";

export async function listFeedback() {
  return await db.select().from(feedbacks).orderBy(desc(feedbacks.upvotes));
}
