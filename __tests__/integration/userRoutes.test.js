import {
	describe,
	it,
	expect,
	beforeAll,
	afterAll,
	beforeEach,
} from "@jest/globals";
import mongoose from "mongoose";
import app from "../../app"; // or wherever your Express app is
import supertest from "supertest";
import User from "../../users/userModel.js";
import jwt from "jsonwebtoken";
import appConfig from "../../config/appConfig.js";

const request = supertest(app);

beforeAll(async () => {
	await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
	await mongoose.connection.dropDatabase(); // clean test DB
	await mongoose.connection.close();
});

beforeEach(async () => {
	await User.deleteMany({});
	await User.create([
		{
			username: "user1",
			password: "password1",
			email: "user1@email.com",
			role: "user",
		},
		{
			username: "admin1",
			password: "adminword1",
			email: "admin1@email.com",
			role: "admin",
		},
	]);
});

describe("POST /api/users/register", () => {
	it("should return 201 when a user is created", async () => {
		const res = await request.post("/api/users/register").send({
			username: "user2",
			password: "password2",
			email: "user2@email.com",
			role: "user",
		});

		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty("createdUser");
	});

	it("should return 400 when user already exists", async () => {
		const res = await request.post("/api/users/register").send({
			username: "user1",
			password: "password1",
			email: "user1@email.com",
			role: "user",
		});

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe(
			"User with that email or username already exists",
		);
	});
});

describe("GET /api/users/profile", () => {
	let token;
	let user;

	beforeEach(async () => {
		user = await User.findOne({ email: "user1@email.com" });

		token = jwt.sign({ id: user._id }, appConfig.accessJWT, {
			expiresIn: appConfig.accessEXP,
		});
	});

	it("should return 200 and user data with valid token", async () => {
		const res = await request
			.get("/api/users/profile")
			.set("Authorization", `Bearer ${token}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("user");
		expect(res.body.user.email).toBe(user.email);
		expect(res.body.user).not.toHaveProperty("password");
	});

	it("should return 401 if no token provided", async () => {
		const res = await request.get("/api/users/profile");

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toMatch(/no token/i);
	});
});

describe("GET /api/users/admin", () => {
	let adminToken;
	let userToken;

	beforeEach(async () => {
		const admin = await User.findOne({ email: "admin1@email.com" });
		const user = await User.findOne({ email: "user1@email.com" });

		adminToken = jwt.sign(
			{ id: admin._id, role: admin.role },
			appConfig.accessJWT,
			{
				expiresIn: appConfig.accessEXP || "10m",
			},
		);

		userToken = jwt.sign(
			{ id: user._id, role: user.role },
			appConfig.accessJWT,
			{
				expiresIn: appConfig.accessEXP || "10m",
			},
		);
	});

	it("should return 200 and list of users when requested by admin", async () => {
		const res = await request
			.get("/api/users/admin")
			.set("Authorization", `Bearer ${adminToken}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("users");
		expect(Array.isArray(res.body.users)).toBe(true);
	});

	it("should return 401 when no token is provided", async () => {
		const res = await request.get("/api/users/admin");

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toMatch(/no token/i);
	});

	it("should return 403 when user is not an admin", async () => {
		const res = await request
			.get("/api/users/admin")
			.set("Authorization", `Bearer ${userToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body.message).toContain("Not authorized");
	});
});
