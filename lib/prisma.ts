import { PrismaClient } from "@/generated/prisma";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaNeon({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = new PrismaClient({ adapter }));
