import bcrypt from "bcryptjs";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../middleware/error.js";
import { signPlatformToken } from "../../middleware/platform-auth.js";
import { createSections, defaultSections } from "../store-sections/store-sections.repository.js";
import { createItems, defaultNavItems } from "../navigation/navigation.repository.js";
import {
  createBusiness,
  createBusinessMember,
  createPlatformUser,
  findBusinessById,
  findBusinessBySlug,
  findFirstMembershipForUser,
  findPlatformUserByEmail,
  updateBusiness,
} from "./platform.repository.js";
import type {
  PlatformLoginInput,
  RegisterBusinessInput,
  UpdateBusinessInput,
} from "./platform.schema.js";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueSlug(businessName: string): Promise<string> {
  const base = slugify(businessName) || "business";
  let slug = base;
  let suffix = 2;

  while (await findBusinessBySlug(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function registerBusiness(input: RegisterBusinessInput) {
  const existing = await findPlatformUserByEmail(input.email);
  if (existing) {
    throw new ConflictError("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await createPlatformUser({
    email: input.email,
    passwordHash,
    name: input.name,
  });

  const slug = await generateUniqueSlug(input.businessName);
  const business = await createBusiness({
    name: input.businessName,
    slug,
  });

  await createBusinessMember({
    businessId: business.id,
    userId: user.id,
    role: "owner",
  });

  await createSections(defaultSections(business.id, business.name));
  await createItems(defaultNavItems(business.id));

  const token = await signPlatformToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    businessId: business.id,
    businessRole: "owner",
  });

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
    business: {
      id: business.id,
      name: business.name,
      slug: business.slug,
      currency: business.currency,
      theme: business.theme,
      customDomain: business.customDomain,
    },
    role: "owner",
  };
}

export async function loginPlatformUser(input: PlatformLoginInput) {
  const user = await findPlatformUserByEmail(input.email);
  if (!user || !user.isActive) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const membership = await findFirstMembershipForUser(user.id);
  if (!membership) {
    throw new UnauthorizedError("This account is not linked to any business yet");
  }

  const token = await signPlatformToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    businessId: membership.business.id,
    businessRole: membership.role,
  });

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
    business: {
      id: membership.business.id,
      name: membership.business.name,
      slug: membership.business.slug,
      currency: membership.business.currency,
      theme: membership.business.theme,
      customDomain: membership.business.customDomain,
    },
    role: membership.role,
  };
}

export async function updateBusinessSettings(businessId: string, input: UpdateBusinessInput) {
  const business = await findBusinessById(businessId);
  if (!business) throw new NotFoundError("Business not found");

  const patch: { theme?: string; customDomain?: string | null } = {};
  if (input.theme !== undefined) patch.theme = input.theme;
  if (input.customDomain !== undefined) patch.customDomain = input.customDomain;

  return updateBusiness(businessId, patch);
}
