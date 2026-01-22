import { z } from "zod";
export const createFeedbackSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
});
//# sourceMappingURL=index.js.map