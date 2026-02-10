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

  const user = await db.query.users.findFirst({
    columns: { token: true },
    where: and(
      eq(users.id, ctx.user.id),
      eq(users.token, ctx.user.token || ""),
    ),
  });

  return { authenticated: !!user?.token };
};
