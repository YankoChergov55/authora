import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import jwt from "jsonwebtoken";
import appConfig from "../../config/appConfig.js";
import { authenticate } from "../../middleware/authMiddleware.js";
import User from "../../users/userModel.js";
import AppError from "../../utils/appError.js";

let req, res, next;

beforeEach(() => {
	req = {
		headers: {
			autorization: "",
		},
	};

	res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};

	next = jest.fn();
});

describe("authentication middlware", () => {
	it("calls next and attaches user to req when token is valid", async () => {
		const payload = { id: "123abc", email: "user@email.com" };
		const token = jwt.sign(payload, appConfig.accessJWT, { expiresIn: "1h" });

		req.headers.authorization = `Bearer ${token}`;

		jest.spyOn(User, "findById").mockReturnValue({
			select: jest.fn().mockResolvedValue({
				_id: "123abc",
				email: payload.email,
				role: "user",
			}),
		});

		await authenticate(req, res, next);

		expect(next).toHaveBeenCalledWith(); // no error passed
		expect(req.user).toBeDefined();
	});

	it("calls next with AppError when it is missing authorization header", async () => {
		req.headers = {};

		await authenticate(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(AppError));
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "No token provided",
				status: 401,
			}),
		);
		expect(req.user).toBeUndefined();
	});

	it("calls next with AppError when authorization header is malformed", async () => {
		req.headers.authorization = "some_token_without_bearer_prefix";

		await authenticate(req, res, next);

		expect(req.user).toBeUndefined();

		// expect(next).toHaveBeenCalledTimes(1);

		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({ message: "No token provided", status: 401 }),
		);
	});

	it("handles invalid token", async () => {
		const payload = { id: "123abc", email: "user@email.com" };
		const token = jwt.sign(payload, "123abc456de", {
			expiresIn: appConfig.accessEXP,
		});
		req.headers.authorization = `Bearer ${token}`;

		await authenticate(req, res, next);

		expect(req.user).toBeUndefined();
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Invalid token. Access denied.",
				status: 401,
			}),
		);
	});

	it("handles expired tokens", async () => {
		const payload = { id: "123abc", email: "user@email.com" };
		const token = jwt.sign(payload, appConfig.accessJWT, {
			expiresIn: "1s",
		});
		req.headers.authorization = `Bearer ${token}`;

		jest.spyOn(jwt, "verify").mockImplementation(() => {
			throw Object.assign(new Error("jwt expired"), {
				name: "TokenExpiredError",
			});
		});

		await authenticate(req, res, next);

		expect(req.user).toBeUndefined();
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Access token expired, please go to /refresh to get a new one",
				status: 401,
			}),
		);
	});
});
