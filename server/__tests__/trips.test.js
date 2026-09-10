// server/__tests__/trips.test.js
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const Trip = require("../models/Trip");
const User = require("../models/User");

jest.mock("../models/Trip");
jest.mock("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "voyagr_dev_secret_change_in_production";

// Helper: build a signed cookie for a logged-in user, and mock the
// auth middleware's DB lookup so it resolves to that same user.
function loginCookieFor(userId) {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
  User.findById.mockReturnValue({
    select: jest.fn().mockResolvedValue({ _id: userId, name: "Tanya", email: "tanya@example.com" }),
  });
  return `token=${token}`;
}

describe("GET /api/trips (auth protection)", () => {
  it("returns 401 when no auth cookie is present", async () => {
    const res = await request(app).get("/api/trips");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/not authenticated/i);
  });

  it("returns 401 for an invalid/garbage token", async () => {
    const res = await request(app).get("/api/trips").set("Cookie", "token=not-a-real-jwt");
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /api/trips (authenticated)", () => {
  afterEach(() => jest.clearAllMocks());

  it("returns only the logged-in user's trips", async () => {
    const cookie = loginCookieFor("user123");

    // Trips already have lat/lng so the route skips the geocoding call
    const fakeTrips = [
      { _id: "trip1", title: "Goa Trip", lat: 15.29, lng: 74.12, toObject() { return this; } },
    ];
    Trip.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeTrips) });

    const res = await request(app).get("/api/trips").set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe("Goa Trip");
    expect(Trip.find).toHaveBeenCalledWith({ userId: "user123" });
  });
});

describe("POST /api/trips", () => {
  afterEach(() => jest.clearAllMocks());

  it("rejects an unauthenticated request", async () => {
    const res = await request(app).post("/api/trips").send({ title: "Goa Trip" });
    expect(res.statusCode).toBe(401);
  });

  it("creates a trip for the logged-in user when coordinates are supplied", async () => {
    const cookie = loginCookieFor("user123");

    Trip.create.mockResolvedValue({
      _id: "newtrip1",
      userId: "user123",
      title: "Goa Trip",
      destination: "Goa",
      lat: 15.29,
      lng: 74.12,
    });

    const res = await request(app)
      .post("/api/trips")
      .set("Cookie", cookie)
      .send({ title: "Goa Trip", destination: "Goa", lat: 15.29, lng: 74.12 });

    expect(res.statusCode).toBe(201);
    expect(res.body.destination).toBe("Goa");
    expect(Trip.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user123", title: "Goa Trip" })
    );
  });

  it("returns 400 when Trip creation fails validation", async () => {
    const cookie = loginCookieFor("user123");
    Trip.create.mockRejectedValue(new Error("Trip validation failed: title is required"));

    const res = await request(app)
      .post("/api/trips")
      .set("Cookie", cookie)
      .send({ destination: "Goa", lat: 15.29, lng: 74.12 }); // no title

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/validation failed/i);
  });
});

describe("DELETE /api/trips/:id", () => {
  afterEach(() => jest.clearAllMocks());

  it("returns 404 when the trip doesn't exist or isn't owned by the user", async () => {
    const cookie = loginCookieFor("user123");
    Trip.findOneAndDelete.mockResolvedValue(null);

    const res = await request(app).delete("/api/trips/doesnotexist").set("Cookie", cookie);

    expect(res.statusCode).toBe(404);
  });

  it("deletes a trip belonging to the user", async () => {
    const cookie = loginCookieFor("user123");
    Trip.findOneAndDelete.mockResolvedValue({ _id: "trip1", userId: "user123" });

    const res = await request(app).delete("/api/trips/trip1").set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
