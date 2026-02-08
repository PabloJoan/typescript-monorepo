import { protectedProcedure, router, publicProcedure } from "./trpc";
import { helloSchema, loginSchema } from "@repo/shared";
import { hello } from "./controller/hello";
import { login } from "./controller/auth/login";
import { logout } from "./controller/auth/logout";
import { checkSession } from "./controller/auth/checkSession";

export const appRouter = router({
  hello: publicProcedure.input(helloSchema).query(hello),
  auth: router({
    login: publicProcedure.input(loginSchema).mutation(login),
    logout: protectedProcedure.mutation(logout),
    checkSession: protectedProcedure.query(checkSession),
  }),
});

export type AppRouter = typeof appRouter;
