import request from "supertest";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import bcryptjs from "bcryptjs";
import app from "../../../app";
import { db } from "../../../db";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";

const TEST_USER = {
  email: "testuser@example.com",
  password: "SecurePass123",
  role: "USER",
};

describe("RegisterUser Integration Test", () => {
  beforeEach(async () => {
    await db.delete(users);
  });

  afterAll(async () => {
    await db.$client.end();
  });

  it("should register a new user successfully", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(TEST_USER)
      .expect(201);

    expect(response.body).toHaveProperty(
      "message",
      "User created successfully",
    );
    expect(response.body.user.email).toBe(TEST_USER.email);
    expect(response.body.user.role).toBe(TEST_USER.role);

    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.email, TEST_USER.email))
      .limit(1);
    expect(dbUser.length).toBe(1);

    const dbUserPassword = dbUser[0].password;
    expect(dbUserPassword).not.toBeNull();

    const isPasswordValid = await bcryptjs.compare(
      TEST_USER.password,
      dbUserPassword as string,
    );
    expect(isPasswordValid).toBe(true);
  });

  it("should return error if email is already registered", async () => {
    await db.insert(users).values({
      email: TEST_USER.email,
      password: await bcryptjs.hash(TEST_USER.password, 10),
      role: "USER",
    });

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(TEST_USER)
      .expect(400);

    expect(response.body).toHaveProperty("error", "User already exists");
  });

  it("should return validation error for invalid input", async () => {
    const invalidUser = {
      email: "invalid-email",
      password: "short",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(invalidUser)
      .expect(400);

    expect(response.body).toHaveProperty("error", "Invalid input data");
  });
});
