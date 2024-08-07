import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./user";

export const dokumenwargaSchema = pgTable("dokumen-wargas", {
  id: serial("id").primaryKey(),
  dokumen_url: varchar("dokumen_url", { length: 256 }),
  status: boolean("status").notNull().default(false),
  description: varchar("description", { length: 256 }),

  // user id
  user_id: integer("user_id")
    .notNull()
    .references(() => usersSchema.id),

  // timestamp
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
