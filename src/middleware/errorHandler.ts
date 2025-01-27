import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";

export const globalErrorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  if (err instanceof CustomError && err.isOperational) {
    console.error("Operational error", err.message);
    return res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
    });
  } else {
    console.error("programming error", err);

    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Something went wrong on our end. Please try again later.",
    });
  }
};
