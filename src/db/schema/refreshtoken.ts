import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./user";

export const refreshTokenSchema = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => usersSchema.id),
  token: varchar("token", { length: 512 }).notNull(),
  expires_at: timestamp("expires_at").notNull(),

  // timestamp
  created_at: timestamp("created_at").notNull().defaultNow(),
});
