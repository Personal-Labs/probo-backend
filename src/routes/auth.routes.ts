import { Router } from "express";
import { RegisterUser } from "../controller/auth.controller";

const AuthRouter = Router();

AuthRouter.route("/register").post(RegisterUser);

export default AuthRouter;
