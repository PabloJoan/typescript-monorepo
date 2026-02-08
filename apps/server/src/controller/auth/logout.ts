import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import { Context } from "../../trpc";

type Input = {
  ctx: Context;
};

export const logout = async ({ ctx }: Input) => {
  if (!ctx.user) {
    throw new Error("User not found");
  }
  await db.update(users).set({ token: null }).where(eq(users.id, ctx.user.id));
  return { success: true };
};
