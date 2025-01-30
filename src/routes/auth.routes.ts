import { Router } from "express";
import { RegisterUser, UserLogin } from "../controller/auth.controller";

const AuthRouter = Router();

AuthRouter.route("/register").post(RegisterUser);
AuthRouter.route("/login").post(UserLogin);
export default AuthRouter;
