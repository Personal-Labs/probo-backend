import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import { users } from "../db/schema";
import { db } from "../db";
import { AuthSchema, AuthSchemaType } from "../utils/validators/auth.validator";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";

const SALTS = parseInt(process.env.SALT_ROUNDS || "10", 10);

export const RegisterUser = async (
  req: Request<AuthSchemaType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isValidData = AuthSchema.safeParse(req.body);
    if (!isValidData.success) {
      throw new CustomError("Validation Error", 400);
    }

    await db.transaction(async (txn) => {
      let user = await txn.query.users.findFirst({
        where: eq(users.email, req.body.email),
      });

      if (user) {
        throw new CustomError("User already exists", 400);
      }

      const hashedPassword = await bcryptjs.hash(
        isValidData.data.password,
        SALTS,
      );

      const insertedUsers = await txn
        .insert(users)
        .values({
          email: isValidData.data.email,
          password: hashedPassword,
          role: isValidData.data.role,
        })
        .returning();

      user = insertedUsers[0];

      return res.status(201).json({
        message: "User created successfully",
        user: {
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};
