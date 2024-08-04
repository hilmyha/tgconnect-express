import { timestamp } from "drizzle-orm/pg-core";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const usersSchema = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),

    // timestamp
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (users) => {
    return {
      usernameIndex: uniqueIndex("username").on(users.username),
      emailIndex: uniqueIndex("email").on(users.email),
    };
  }
);
