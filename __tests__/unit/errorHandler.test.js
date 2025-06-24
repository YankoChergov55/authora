import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import errorHandler from "../../middleware/errorHandler.js";
import AppError from "../../utils/appError.js";

let req, res, next;

beforeEach(() => {
	req = {};

	res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};

	next = jest.fn();
});

describe("error hanler middleware", () => {
	it("AppError should return proper status message", () => {
		const error = new AppError("Validation failed", 400, [
			{ path: "email", message: "Invalid email" },
		]);
		// const req = {};
		// const res = {
		// 	status: jest.fn().mockReturnThis(),
		// 	json: jest.fn(),
		// };
		// const next = jest.fn();

		errorHandler(error, req, res, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				success: false,
				message: "Validation failed",
				statusCode: 400,
				details: expect.any(Array),
			}),
		);
	});

	it("jsonwebtokenerror should return 401", () => {
		const jwtError = new Error("jwt malformed");
		jwtError.name = "JsonWebTokenError";
		errorHandler(jwtError, req, res, next);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: "Invalid or expired token",
		});
	});

	it("should handle mongoose validation error", () => {
		const error = new Error("Validation failed");
		error.name = "ValidationError";
		error.errors = {
			username: { message: "Username is required" },
			email: { message: "Email is invalid" },
		};
		errorHandler(error, req, res, next);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				success: false,
				message: "Validation Error from Mongo",
				details: ["Username is required", "Email is invalid"],
			}),
		);
	});
});
