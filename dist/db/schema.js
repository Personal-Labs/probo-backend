"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpsRelations = exports.payoutsRelations = exports.eventParticipantsRelations = exports.eventsRelations = exports.portfoliosRelations = exports.usersRelations = exports.otps = exports.payouts = exports.eventParticipants = exports.events = exports.portfolios = exports.users = exports.payoutStatusEnum = exports.eventStatusEnum = exports.userRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Enums
exports.userRoleEnum = (0, pg_core_1.pgEnum)("user_role", ["ADMIN", "USER"]);
exports.eventStatusEnum = (0, pg_core_1.pgEnum)("event_status", ["ONGOING", "ENDED"]);
exports.payoutStatusEnum = (0, pg_core_1.pgEnum)("payout_status", [
    "PENDING",
    "PLACED",
    "COMPLETED",
]);
// Users Table
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    balance: (0, pg_core_1.integer)("balance").default(0),
    role: (0, exports.userRoleEnum)("role").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
// Portfolios Table
exports.portfolios = (0, pg_core_1.pgTable)("portfolios", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    currentBalances: (0, pg_core_1.real)("current_balances").default(0.0).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// Events Table
exports.events = (0, pg_core_1.pgTable)("events", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    slug: (0, pg_core_1.varchar)("slug").unique().notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    title: (0, pg_core_1.varchar)("title").notNull(),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date").notNull(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    minBet: (0, pg_core_1.real)("min_bet").notNull(),
    maxBet: (0, pg_core_1.real)("max_bet").notNull(),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    sot: (0, pg_core_1.text)("sot").notNull(),
    traders: (0, pg_core_1.integer)("traders").default(0).notNull(),
    status: (0, exports.eventStatusEnum)("status").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// Event Participants Table
exports.eventParticipants = (0, pg_core_1.pgTable)("event_participants", {
    eventId: (0, pg_core_1.integer)("event_id")
        .references(() => exports.events.id, { onDelete: "cascade" })
        .notNull(),
    userId: (0, pg_core_1.integer)("user_id")
        .references(() => exports.users.id, { onDelete: "cascade" })
        .notNull(),
});
// Payouts Table
exports.payouts = (0, pg_core_1.pgTable)("payouts", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id")
        .references(() => exports.users.id, { onDelete: "cascade" })
        .notNull(),
    amount: (0, pg_core_1.real)("amount").notNull(),
    status: (0, exports.payoutStatusEnum)("status").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// OTPs Table
exports.otps = (0, pg_core_1.pgTable)("otps", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.id, {
        onDelete: "cascade",
    }),
    otp: (0, pg_core_1.varchar)("otp").unique().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false).notNull(),
});
// Relations
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    portfolios: many(exports.portfolios),
    payouts: many(exports.payouts),
    otps: many(exports.otps),
    eventParticipants: many(exports.eventParticipants),
}));
exports.portfoliosRelations = (0, drizzle_orm_1.relations)(exports.portfolios, ({ one }) => ({
    user: one(exports.users, { fields: [exports.portfolios.userId], references: [exports.users.id] }),
}));
exports.eventsRelations = (0, drizzle_orm_1.relations)(exports.events, ({ many }) => ({
    eventParticipants: many(exports.eventParticipants),
}));
exports.eventParticipantsRelations = (0, drizzle_orm_1.relations)(exports.eventParticipants, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.eventParticipants.userId],
        references: [exports.users.id],
    }),
    event: one(exports.events, {
        fields: [exports.eventParticipants.eventId],
        references: [exports.events.id],
    }),
}));
exports.payoutsRelations = (0, drizzle_orm_1.relations)(exports.payouts, ({ one }) => ({
    user: one(exports.users, { fields: [exports.payouts.userId], references: [exports.users.id] }),
}));
exports.otpsRelations = (0, drizzle_orm_1.relations)(exports.otps, ({ one }) => ({
    user: one(exports.users, { fields: [exports.otps.userId], references: [exports.users.id] }),
}));
