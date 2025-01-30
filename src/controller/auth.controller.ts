import { Request, Response } from "express";
// import { CustomError } from "../utils/CustomError";
import { users } from "../db/schema";
import { db } from "../db";
import { AuthSchema, AuthSchemaType } from "../utils/validators/auth.validator";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const SALTS = parseInt(process.env.SALT_ROUNDS || "10", 10);
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const RegisterUser = async (
  req: Request<object, object, AuthSchemaType>,
  res: Response,
  // next: NextFunction,
): Promise<void> => {
  try {
    const isValidData = AuthSchema.safeParse(req.body);
    if (!isValidData.success) {
      res.status(400).json({
        error: "Invalid input data",
      });
      return;
    }

    await db.transaction(async (txn) => {
      const existingUser = await txn
        .select()
        .from(users)
        .where(eq(users.email, req.body.email))
        .limit(1);

      if (existingUser.length > 0) {
        res.status(400).json({
          error: "User already exists",
        });
        return;
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

      const user = insertedUsers[0];

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

export const UserLogin = async (
  req: Request<object, object, AuthSchemaType>,
  res: Response,
): Promise<void> => {
  try {
    const isValidData = AuthSchema.safeParse(req.body);
    if (!isValidData) {
      res.status(400).json({
        error: "Invalid input data",
      });
      return;
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, req.body.email))
      .limit(1);

    if (user.length === 0 || !user[0].password) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcryptjs.compare(
      req.body.password,
      user[0].password,
    );

    if (!isPasswordValid) {
      res.status(401).json({
        error: "Invalid password",
      });
      return;
    }

    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, role: user[0].role },
      JWT_SECRET,
      {
        expiresIn: "10h",
      },
    );

    res.status(200).json({
      message: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};
