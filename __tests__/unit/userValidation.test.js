import { describe, it, expect } from "@jest/globals";
import { registerSchema } from "../../users/userValidation.js";

describe("user validation module", () => {
	it("should validate a correct registration input", () => {
		const validInput = {
			username: " user1 ",
			password: "password1",
			email: "User1@Email.com",
		}; // valid user input based on db and zod schemas that I have defined

		const result = registerSchema.parse(validInput); // parsing agains the register schema
		expect(result).toEqual({
			username: "user1",
			password: "password1",
			email: "user1@email.com",
			role: "user",
		}); // parse returns the validated and transformed data so this should be a sign that the module works
	});

	it("should reject invalid email", () => {
		const invalidInput = {
			username: " user1 ",
			password: "password1",
			email: "User1@Email",
		};

		const result = registerSchema.safeParse(invalidInput);

		expect(result.success).toBe(false);
		expect(result.error.issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					path: ["email"],
				}),
			]),
		);
	});

	it.each([
		["username", { email: "user1@email.com", password: "password1" }],
		["email", { username: "user1", password: "password1" }],
		["password", { username: "user1", email: "user1@email.com" }],
	])("should fail if %s is missing", (missingField, input) => {
		const result = registerSchema.safeParse(input);

		expect(result.success).toBe(false);
		expect(result.error.issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					path: [missingField],
				}),
			]),
		);
	});

	it("should reject password that is shorter", () => {
		const shortPasswordInput = {
			username: "user1",
			password: "pass1",
			email: "user1@email.com",
			role: "user",
		};

		const result = registerSchema.safeParse(shortPasswordInput);

		expect(result.success).toBe(false);
		expect(result.error.issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					path: ["password"],
				}),
			]),
		);
	});
});
