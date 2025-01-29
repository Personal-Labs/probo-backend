import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import app from "../../../app";
import { db } from "../../../db";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashedPassword123"),
  },
}));

vi.mock("../../../db", () => ({
  db: {
    transaction: vi.fn(),
  },
}));

describe("User Registration API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.log("Mocks restored before test case execution");
  });

  it("should register a new user successfully", async () => {
    console.log("Test: Register a new user");

    (db.transaction as unknown as jest.Mock).mockImplementationOnce(
      async (callback) => {
        console.log("Mock transaction started for new user registration");
        const txn = {
          select: vi.fn().mockReturnThis(),
          from: vi.fn().mockReturnThis(),
          where: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue([]),
          insert: vi.fn().mockReturnThis(),
          values: vi.fn().mockReturnThis(),
          returning: vi.fn().mockResolvedValue([
            {
              email: "test@example.com",
              role: "USER",
            },
          ]),
        };
        return callback(txn);
      },
    );

    console.log("Sending API request for user registration...");
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "test@example.com",
      password: "securepassword123",
      role: "USER",
    });

    console.log("Response received:", response.body);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User created successfully",
      user: {
        email: "test@example.com",
        role: "USER",
      },
    });
  });

  it("should return 400 if the user already exists", async () => {
    console.log("Test: Check response when user already exists");

    (db.transaction as unknown as jest.Mock).mockImplementationOnce(
      async (callback) => {
        console.log("Mock transaction started for existing user check");
        const txn = {
          select: vi.fn().mockReturnThis(),
          from: vi.fn().mockReturnThis(),
          where: vi.fn().mockReturnThis(),
          limit: vi
            .fn()
            .mockResolvedValue([{ email: "test@example.com", role: "USER" }]),
        };
        return callback(txn);
      },
    );

    const response = await request(app).post("/api/v1/auth/register").send({
      email: "test@example.com",
      password: "securepassword123",
      role: "USER",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "User already exists",
    });
  });

  it("should return 400 for validation errors", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "invalid-email",
      password: "123",
      role: "INVALID_ROLE",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Invalid input data",
    });
  });

  it("should return 500 if database transaction fails", async () => {
    (db.transaction as unknown as jest.Mock).mockImplementationOnce(
      async () => {
        throw new Error("Database error");
      },
    );

    const response = await request(app).post("/api/v1/auth/register").send({
      email: "newuser@example.com",
      password: "securepassword123",
      role: "USER",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Something went wrong",
    });
  });
});
