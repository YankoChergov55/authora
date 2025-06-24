import { describe, it, expect, jest } from "@jest/globals";
import { registerSchema } from "../../users/userValidation.js";
import validate from "../../middleware/validationMiddleware.js";
import AppError from "../../utils/appError.js";

describe("validation middleware", () => {
	it("should call next() when data is valid", () => {
		const req = {
			body: {
				username: "user1",
				password: "password1",
				email: "user1@email.com",
				role: "user",
			},
		};
		const res = {};
		const next = jest.fn();

		const middleware = validate(registerSchema);

		middleware(req, res, next);

		expect(next).toHaveBeenCalled();
		expect(typeof req.validatedData).toBe("object");
	});

	it("should call next() with AppError if data is invalid", () => {
		const req = {
			body: {
				username: "user",
				password: "passw",
				email: "useemail.com",
				role: "user",
			},
		};
		const res = {};
		const next = jest.fn();

		const middleware = validate(registerSchema);
		middleware(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(AppError));

		const errorPassed = next.mock.calls[0][0];
		expect(errorPassed.status).toBe(400);
		expect(errorPassed.message).toBe("Zod Validation Failed");
	});
});
