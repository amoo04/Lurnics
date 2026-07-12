import bcrypt from "bcryptjs";
import { signToken } from "../../middleware/auth.js";
import { UnauthorizedError } from "../../middleware/error.js";
import { findUserWithAccessByEmail } from "./auth.repository.js";

export interface LoginInput {
  email: string;
  password: string;
}

export async function login({ email, password }: LoginInput) {
  const user = await findUserWithAccessByEmail(email);

  if (!user || !user.isActive) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = await signToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    permissions: user.permissions,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    },
  };
}
