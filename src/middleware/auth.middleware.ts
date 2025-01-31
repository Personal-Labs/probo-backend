import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import { UserPayload } from "../types/types";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined");
}
declare module "express" {
  export interface Request {
    user?: UserPayload;
  }
}

export const verifyRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized User: Token is missing" });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (
        typeof decoded === "object" &&
        decoded !== null &&
        "email" in decoded &&
        "id" in decoded
      ) {
        req.user = decoded as UserPayload;
        next();
      } else {
        res.status(401).json({ message: "Invalid Token Structure" });
        return;
      }
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ message: "Invalid Token" });
      return;
    }
  } catch (error) {
    console.error("Request verification error:", error);
    res.status(500).json({
      message: "Internal server error during request verification",
    });
  }
};
