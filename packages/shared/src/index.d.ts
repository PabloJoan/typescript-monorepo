import { z } from "zod";
export declare const createFeedbackSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
}, z.core.$strip>;
export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
//# sourceMappingURL=index.d.ts.map