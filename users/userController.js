import AppError from "../utils/appError.js";
import appConfig from "../config/appConfig.js";
import User from "./userModel.js";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req, res, next) => {
	try {
		const { username, email, password } = req.validatedData;

		const createdUser = await User.create({ username, email, password });

		res.status(201).json({
			success: true,
			message: "user has been created",
			createdUser,
		});
	} catch (error) {
		next(error);
	}
};

export const loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.validatedData;

		const foundUser = await User.findOne({ email });
		if (!foundUser) {
			throw new AppError(401, "Password or Email is wrong");
		}

		const matchingPassword = await compare(password, foundUser.password);
		if (!matchingPassword) {
			throw new AppError(401, "Password or Email is wrong");
		}

		const tokenData = { id: foundUser._id, email: foundUser.email };
		const accessToken = jwt.sign(tokenData, appConfig.accessJWT, {
			expiresIn: appConfig.accessEXP,
		});
		const refreshToken = jwt.sign(tokenData, appConfig.refreshJWT, {
			expiresIn: appConfig.refreshEXP,
		});

		res
			.status(200)
			.cookie("refreshtoken", refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 24 * 60 * 60 * 1000,
			})
			.json({
				success: true,
				message: "user logged in",
				accessToken,
			});
	} catch (error) {
		next(error);
	}
};
