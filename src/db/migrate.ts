import { migrate } from "drizzle-orm/postgres-js/migrator";
import db from "./connection";

async function migrateData() {
  await migrate(db, { migrationsFolder: "./src/drizzle/migrations" });
  process.exit(0);
}

migrateData().catch((err) => {
  console.error(err);
  process.exit(1);
});
