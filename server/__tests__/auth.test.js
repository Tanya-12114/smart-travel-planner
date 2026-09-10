// server/__tests__/auth.test.js
const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

// Mock the User model so tests never touch a real database
jest.mock("../models/User");

describe("POST /api/auth/register", () => {
  afterEach(() => jest.clearAllMocks());

  it("rejects when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "tanya@example.com", password: "secret123" }); // no name

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it("rejects a password shorter than 6 characters", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Tanya", email: "tanya@example.com", password: "123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/at least 6 characters/i);
  });

  it("rejects registration when the email is already in use", async () => {
    User.findOne.mockResolvedValue({ _id: "existing123", email: "tanya@example.com" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Tanya", email: "tanya@example.com", password: "secret123" });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it("creates a new user with valid data", async () => {
    User.findOne.mockResolvedValue(null); // no existing account
    User.create.mockResolvedValue({
      _id: "newuser123",
      name: "Tanya",
      email: "tanya@example.com",
    });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Tanya", email: "tanya@example.com", password: "secret123" });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe("tanya@example.com");
    // Password should never be echoed back
    expect(res.body.user.password).toBeUndefined();
  });
});

describe("POST /api/auth/login", () => {
  afterEach(() => jest.clearAllMocks());

  it("rejects when email or password is missing", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "tanya@example.com" });
    expect(res.statusCode).toBe(400);
  });

  it("rejects login when no account exists for the email", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ghost@example.com", password: "secret123" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/no account found/i);
  });

  it("rejects login with an incorrect password", async () => {
    User.findOne.mockResolvedValue({
      _id: "user123",
      email: "tanya@example.com",
      matchPassword: jest.fn().mockResolvedValue(false),
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "tanya@example.com", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/incorrect password/i);
  });

  it("logs in successfully with correct credentials", async () => {
    User.findOne.mockResolvedValue({
      _id: "user123",
      email: "tanya@example.com",
      matchPassword: jest.fn().mockResolvedValue(true),
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "tanya@example.com", password: "secret123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe("tanya@example.com");
    // A session cookie should be set on successful login
    expect(res.headers["set-cookie"][0]).toMatch(/token=/);
  });
});
