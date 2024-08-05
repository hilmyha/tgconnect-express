import {
  pgTable,
  serial,
  uniqueIndex,
  varchar,
  boolean,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";

export const statusKependudukan = pgEnum("status_kependudukan", [
  "Penduduk Tetap",
  "Penduduk Sementara",
]);

export const usersSchema = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),

    // is_admin
    is_admin: boolean("is_admin").notNull().default(false),

    // data warga
    nama: varchar("nama", { length: 256 }),
    no_handphone: varchar("no_handphone", { length: 256 }),
    jalan: varchar("jalan", { length: 256 }),
    blok: varchar("blok", { length: 256 }),
    status_kependudukan: statusKependudukan("status_kependudukan"),

    // timestamp
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (users) => {
    return {
      usernameIndex: uniqueIndex("username").on(users.username),
      emailIndex: uniqueIndex("email").on(users.email),
    };
  }
);
