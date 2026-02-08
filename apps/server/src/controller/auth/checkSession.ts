import { Context } from "../../trpc";
import { db } from "../../db";
import { users } from "../../db/schema";
import { and, eq } from "drizzle-orm";

type Input = {
  ctx: Context;
};

export const checkSession = async ({ ctx }: Input) => {
  if (!ctx.user) {
    return { authenticated: false };
  }

  const user = (
    await db
      .select({ token: users.token })
      .from(users)
      .where(
        and(eq(users.id, ctx.user.id), eq(users.token, ctx.user.token || "")),
      )
      .limit(1)
  )[0];

  return { authenticated: !!user.token };
};
