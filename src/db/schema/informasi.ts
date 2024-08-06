import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  date,
  time,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./user";

export const informasiSchema = pgTable("informasis", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }).notNull(),
  date: date("date", { mode: "string" }).notNull(),
  time: time("time", { withTimezone: true }).notNull(),

  // user id
  user_id: integer("user_id")
    .notNull()
    .references(() => usersSchema.id),

  // timestamp
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
