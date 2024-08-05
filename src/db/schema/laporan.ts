import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./user";

export const laporanEnum = pgEnum("laporan_status", ["Penting", "Sedang"]);

export const laporanSchema = pgTable("laporans", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }).notNull(),
  location: varchar("location", { length: 256 }).notNull(),
  status: laporanEnum("status").notNull(),

  // photo url
  photo_url: varchar("photo_url", { length: 256 }).notNull(),

  // user id
  user_id: integer("user_id")
    .notNull()
    .references(() => usersSchema.id),

  // timestamp
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
