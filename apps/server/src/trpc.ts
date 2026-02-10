import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { users } from "./db/schema";
import { eq, and } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the env.");
}

export const createContext = async ({
  req,
}: trpcExpress.CreateExpressContextOptions) => {
  const authHeader = req.headers.authorization;
  let user = null;

  if (!authHeader) {
    return { user };
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    if (decoded.userId) {
      user = await db.query.users.findFirst({
        columns: { id: true, email: true, name: true, token: true },
        where: and(eq(users.id, decoded.userId), eq(users.token, token)),
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Token verification failed:", err);
  }

  return { user };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
