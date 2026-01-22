import { router, publicProcedure } from "./trpc";
import {
  createFeedbackSchema,
  deleteFeedbackSchema,
  helloSchema,
  upvoteFeedbackSchema,
} from "@repo/shared";
import { createFeedback } from "./controller/feedback/createFeedback";
import { listFeedback } from "./controller/feedback/listFeedback";
import { upvoteFeedback } from "./controller/feedback/upvoteFeedback";
import { deleteFeedback } from "./controller/feedback/deleteFeedback";
import { hello } from "./controller/hello";

export const appRouter = router({
  hello: publicProcedure.input(helloSchema).query(hello),

  feedback: router({
    list: publicProcedure.query(listFeedback),

    create: publicProcedure
      .input(createFeedbackSchema)
      .mutation(createFeedback),

    upvote: publicProcedure
      .input(upvoteFeedbackSchema)
      .mutation(upvoteFeedback),

    delete: publicProcedure
      .input(deleteFeedbackSchema)
      .mutation(deleteFeedback),
  }),
});

export type AppRouter = typeof appRouter;
