import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";

const adapter = new PrismaPg(
  {
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
  {
    onPoolError: (err) => {
      console.error("Database pool error:", err);
    },
  },
);

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
