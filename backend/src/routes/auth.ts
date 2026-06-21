import { Hono } from "hono";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "node:crypto";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { signToken } from "../lib/jwt.js";

const auth = new Hono();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey.toString("hex") === hash);
    });
  });
}

auth.post("/register", async (c) => {
  const body = credentialsSchema.parse(await c.req.json());

  const [existing] = await db.select().from(users).where(eq(users.email, body.email));
  if (existing) {
    return c.json({ error: "Email already registered" }, 409);
  }

  const passwordHash = await hashPassword(body.password);
  const [user] = await db.insert(users).values({ email: body.email, passwordHash }).returning();

  const token = await signToken({ sub: String(user.id), email: user.email });
  return c.json({ token });
});

auth.post("/login", async (c) => {
  const body = credentialsSchema.parse(await c.req.json());

  const [user] = await db.select().from(users).where(eq(users.email, body.email));
  if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await signToken({ sub: String(user.id), email: user.email });
  return c.json({ token });
});

export default auth;
