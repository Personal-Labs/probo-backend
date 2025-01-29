import { Request, Response } from "express";
// import { CustomError } from "../utils/CustomError";
import { users } from "../db/schema";
import { db } from "../db";
import { AuthSchema, AuthSchemaType } from "../utils/validators/auth.validator";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";

const SALTS = parseInt(process.env.SALT_ROUNDS || "10", 10);

export const RegisterUser = async (
  req: Request<object, any, AuthSchemaType>,
  res: Response,
  // next: NextFunction,
): Promise<void> => {
  try {
    console.log("RegisterUser controller triggered");

    // Validate user input
    const isValidData = AuthSchema.safeParse(req.body);
    if (!isValidData.success) {
      console.error("Validation failed:", isValidData.error.format());
      res.status(400).json({
        error: "Invalid input data",
      });
      return;
    }

    await db.transaction(async (txn) => {
      console.log("Checking if user already exists:", req.body.email);

      const existingUser = await txn
        .select()
        .from(users)
        .where(eq(users.email, req.body.email))
        .limit(1);

      if (existingUser.length > 0) {
        console.warn("User already exists:", req.body.email);
        res.status(400).json({
          error: "User already exists",
        });
        return;
      }

      console.log("Hashing password...");
      const hashedPassword = await bcryptjs.hash(
        isValidData.data.password,
        SALTS,
      );

      console.log("Inserting new user...");
      const insertedUsers = await txn
        .insert(users)
        .values({
          email: isValidData.data.email,
          password: hashedPassword,
          role: isValidData.data.role,
        })
        .returning();

      const user = insertedUsers[0];

      console.log("User created successfully:", user.email);

      res.status(201).json({
        message: "User created successfully",
        user: {
          email: user.email,
          role: user.role,
        },
      });
      return;
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Something went wrong",
    });
    return;
  }
};
