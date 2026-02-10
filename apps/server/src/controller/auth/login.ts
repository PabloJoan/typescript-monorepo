import { db } from "../../db";
import { users } from "../../db/schema";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { LoginSchema } from "@repo/shared";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_for_dev";

type Input = {
  input: LoginSchema;
};

export const login = async ({ input }: Input) => {
  const user = await db.query.users.findFirst({
    columns: { id: true, email: true, name: true },
    where: eq(users.id, input.uuid),
  });

  if (!user) {
    throw new Error("Failed to create/retrieve user");
  }

  // Sign JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  const updateResults = await db
    .update(users)
    .set({ token: token })
    .where(eq(users.id, user.id));

  return {
    success: updateResults.rowCount === 1,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
};
