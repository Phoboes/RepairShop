import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

export const db = drizzle(neon(process.env.DATABASE_URL!));

// Logger:
// const db = drizzle(neon(process.env.DATABASE_URL!), {
//   logger: true,
// });

// export const customers = db.table("customers");

// export const tickets = db.table("tickets");
