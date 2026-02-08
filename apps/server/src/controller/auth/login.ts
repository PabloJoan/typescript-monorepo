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
  // 2. Upsert user based on accountHolderUid
  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.id, input.uuid))
    .limit(1);

  if (!dbUser[0]) {
    throw new Error("Failed to create/retrieve user");
  }

  // Sign JWT
  const token = jwt.sign(dbUser[0], JWT_SECRET, { expiresIn: "7d" });

  return {
    success: true,
    user: {
      id: dbUser[0].id,
      email: dbUser[0].email,
      name: dbUser[0].name,
    },
    token,
  };
};
