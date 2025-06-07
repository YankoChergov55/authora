import { Router } from "express";
import validate from "../middleware/validationMiddleware.js";
import { registerSchema, loginSchema } from "../users/userValidation.js";
import { createUser, loginUser } from "./userController.js";

const userRouter = Router();

userRouter.post("/register", validate(registerSchema), createUser);

userRouter.post("/login", validate(loginSchema), loginUser);

export default userRouter;
