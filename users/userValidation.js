import { z } from "zod/v4";

const username = z
	.string({
		required_error: "Username is required",
		invalid_type_error: "Must be a string",
	})
	.trim()
	.min(5, { error: "must be at least 5 characters" });

const email = z.email({ error: "invalid email format" }).trim().toLowerCase();

const password = z
	.string({
		required_error: "Password is required",
	})
	.min(8, { error: "Password must be at least 8 characters" });

const role = z.enum(["user", "admin"]).optional().default("user");

export const registerSchema = z.object({
	username,
	email,
	password,
	role,
});

export const loginSchema = z.object({
	email,
	password,
});

export const updateSchema = registerSchema.partial();
