import { Router } from "express";
import validate from "../middleware/validationMiddleware.js";
import { registerSchema, loginSchema } from "../users/userValidation.js";
import {
	adminGetsUserList,
	createUser,
	getUserProfile,
	loginUser,
	logoutUser,
	refreshToken,
} from "./userController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const userRouter = Router();

//public routes

userRouter.post("/register", validate(registerSchema), createUser);

userRouter.post("/login", validate(loginSchema), loginUser);

userRouter.post("/refresh", refreshToken);

userRouter.post("/logout", logoutUser);

//protected routes

userRouter.get("/profile", authenticate, getUserProfile);

userRouter.get("/admin", authenticate, authorize("admin"), adminGetsUserList);

export default userRouter;
