import { and, asc, eq, like } from "drizzle-orm";
import { db } from "../../db/index.js";
import { maintenanceContracts, type NewMaintenanceContractRow } from "../../db/schema.js";

export async function findMaintenanceContracts(
  status: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [];
  if (status) conditions.push(eq(maintenanceContracts.status, status));
  if (search) conditions.push(like(maintenanceContracts.planType, `%${search}%`));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, total] = await Promise.all([
    db.query.maintenanceContracts.findMany({
      where,
      limit,
      offset,
      orderBy: asc(maintenanceContracts.expiryDate),
      with: { client: true, project: true },
    }),
    db.$count(maintenanceContracts, where),
  ]);

  return { items, total };
}

export async function findMaintenanceById(id: string) {
  return db.query.maintenanceContracts.findFirst({
    where: eq(maintenanceContracts.id, id),
    with: { client: true, project: true },
  });
}

export async function createMaintenance(input: NewMaintenanceContractRow) {
  const [row] = await db.insert(maintenanceContracts).values(input).returning();
  return row;
}

export async function updateMaintenance(id: string, input: Partial<NewMaintenanceContractRow>) {
  const [row] = await db
    .update(maintenanceContracts)
    .set(input)
    .where(eq(maintenanceContracts.id, id))
    .returning();
  return row;
}

export async function deleteMaintenance(id: string) {
  await db.delete(maintenanceContracts).where(eq(maintenanceContracts.id, id));
}
