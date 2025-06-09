import AppError from "../utils/appError.js";
import appConfig from "../config/appConfig.js";
import User from "./userModel.js";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req, res, next) => {
	try {
		const { username, email, password, role } = req.validatedData;

		const createdUser = await User.create({ username, email, password, role });

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

export const refreshToken = async (req, res, next) => {
	try {
		// 1. Get the refresh token (from cookies or headers)
		const token = req.cookies?.refreshtoken;
		if (!token) {
			throw new AppError("No refresh token provided", 401);
		}

		// 2. Verify the refresh token
		let decoded;
		try {
			decoded = jwt.verify(token, appConfig.refreshJWT);
		} catch (err) {
			if (err.name === "TokenExpiredError") {
				throw new AppError(
					"Refresh token expired, please log in again via /login",
					403,
				);
			}
			throw new AppError("Invalid refresh token", 403);
		}

		// 3. Validate user
		const user = await User.findById(decoded.id);
		if (!user) {
			throw new AppError("User not found", 404);
		}

		// 4. (Optional) Validate refresh token stored in DB
		// if (user.refreshToken !== token) throw new AppError("Token reuse detected", 403);

		// 5. Generate a new access token
		const newAccessToken = jwt.sign({ id: user._id }, appConfig.accessJWT, {
			expiresIn: "15m",
		});

		// 6. (Optional) Rotate refresh token
		const newRefreshToken = jwt.sign({ id: user._id }, appConfig.refreshJWT, {
			expiresIn: "7d",
		});
		// user.refreshToken = newRefreshToken;
		// await user.save();
		res.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: true,
		});

		// 7. Send new access token
		res.status(200).json({
			status: "success",
			accessToken: newAccessToken,
		});
	} catch (error) {
		next(error);
	}
};

export const logoutUser = async (req, res, next) => {
	try {
		res
			.clearCookie("refreshtoken", {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
			})
			.status(200)
			.json({
				success: true,
				message:
					"User is logged out, please remove access token from client headers.",
			});
	} catch (error) {
		next(error);
	}
};

export const getUserProfile = async (req, res, next) => {
	try {
		const user = req.user;

		if (!user) {
			throw new AppError("No user data", 404);
		}

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		next(error);
	}
};

export const adminGetsUserList = async (req, res, next) => {
	try {
		const user = req.user;

		if (!user) {
			throw new AppError("No user data", 404);
		}

		const users = await User.find({}).select("-password");
		if (!users) {
			throw new AppError("No users found", 404);
		}

		res.status(200).json({
			success: true,
			users,
		});
	} catch (error) {
		next(error);
	}
};
