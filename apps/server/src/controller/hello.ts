import { z } from "zod";
import { helloSchema } from "@repo/shared";

type Input = { input: z.Infer<typeof helloSchema> };

export function hello({ input }: Input) {
  return { greeting: `Hello ${input.name ?? "world"}` };
}
