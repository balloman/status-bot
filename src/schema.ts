import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  host: text("host").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  wasOnline: boolean("was_online").notNull().default(false),
});

export type NewServer = typeof servers.$inferInsert;

export const channels = pgTable("channels", {
  id: text("id").primaryKey(),
});

export type NewChannel = typeof channels.$inferInsert;
