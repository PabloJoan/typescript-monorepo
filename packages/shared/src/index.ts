import { z } from "zod";

export const helloSchema = z.object({ name: z.string().optional() });
export type HelloSchema = z.infer<typeof helloSchema>;

export const loginSchema = z.object({
  uuid: z.uuid(),
});
export type LoginSchema = z.infer<typeof loginSchema>;
