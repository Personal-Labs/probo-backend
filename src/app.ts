import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "./utils/CustomError";
import { globalErrorHandler } from "./middleware/errorHandler";
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.get("/error", (req: Request, res: Response, next: NextFunction) => {
  next(new CustomError("This is a test error", 400));
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new CustomError("Not found", 404));
});

app.use((err: Error | CustomError, req: Request, res: Response) => {
  globalErrorHandler(err, req, res);
});

export default app;
