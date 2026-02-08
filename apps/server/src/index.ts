import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import { createContext } from "./trpc";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      process.env.CLIENT_ORIGIN ||
      "http://localhost:5173",
  }),
);

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.get("/health", (_, res) => {
  res.send("OK");
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${process.env.PORT}`);
});
