import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  varchar,
  boolean,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);
export const eventStatusEnum = pgEnum("event_status", ["ONGOING", "ENDED"]);
export const payoutStatusEnum = pgEnum("payout_status", [
  "PENDING",
  "PLACED",
  "COMPLETED",
]);
export const eventsAnswerEnum = pgEnum("events_answer", ["YES", "NO"]);

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  balance: integer("balance").default(0),
  role: userRoleEnum("role").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  password: varchar("password"),
  OauthId: varchar("OauthId"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Portfolios Table
export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  currentBalances: real("current_balances").default(0.0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Events Table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: varchar("slug").unique().notNull(),
  description: text("description").notNull(),
  title: varchar("title").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  minBet: real("min_bet").notNull(),
  answer: eventsAnswerEnum("answer"),
  maxBet: real("max_bet").notNull(),
  quantity: integer("quantity").notNull(),
  sot: text("sot"),
  traders: integer("traders").default(0).notNull(),
  status: eventStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Event Participants Table
export const eventParticipants = pgTable("event_participants", {
  eventId: integer("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

// Payouts Table
export const payouts = pgTable("payouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  amount: real("amount").notNull(),
  status: payoutStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// OTPs Table
export const otps = pgTable("otps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  otp: varchar("otp").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  portfolios: many(portfolios),
  payouts: many(payouts),
  otps: many(otps),
  eventParticipants: many(eventParticipants),
}));

export const portfoliosRelations = relations(portfolios, ({ one }) => ({
  user: one(users, { fields: [portfolios.userId], references: [users.id] }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  eventParticipants: many(eventParticipants),
}));

export const eventParticipantsRelations = relations(
  eventParticipants,
  ({ one }) => ({
    user: one(users, {
      fields: [eventParticipants.userId],
      references: [users.id],
    }),
    event: one(events, {
      fields: [eventParticipants.eventId],
      references: [events.id],
    }),
  }),
);

export const payoutsRelations = relations(payouts, ({ one }) => ({
  user: one(users, { fields: [payouts.userId], references: [users.id] }),
}));

export const otpsRelations = relations(otps, ({ one }) => ({
  user: one(users, { fields: [otps.userId], references: [users.id] }),
}));
