import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { authorize } from "../../middleware/authMiddleware.js";
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

describe("authorize middleware", () => {
	it("should call next if user has allowed role", () => {
		req.user = { role: "admin" };
		const middleware = authorize("admin", "user");
		middleware(req, res, next);
		expect(next).toHaveBeenCalledWith();
	});

	it("should call next with 403 if user has disallowed roles", () => {
		req.user = { role: "user" };
		const middleware = authorize("admin");
		middleware(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(AppError));
		const err = next.mock.calls[0][0];
		expect(err.status).toBe(403);
		expect(err.message).toBe("Not authorized");
	});

	it("should return 401 if no req.user is present", () => {
		req.user = undefined;
		const middleware = authorize("admin");
		middleware(req, res, next);
		expect(next).toHaveBeenCalledWith(expect.any(AppError));
		const err = next.mock.calls[0][0];
		expect(err.status).toBe(401);
		expect(err.message).toBe("Not authenticated");
	});
});
