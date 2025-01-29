import { pgTable, unique, serial, varchar, integer, timestamp, boolean, text, real, foreignKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const eventStatus = pgEnum("event_status", ['ONGOING', 'ENDED'])
export const payoutStatus = pgEnum("payout_status", ['PENDING', 'PLACED', 'COMPLETED'])
export const userRole = pgEnum("user_role", ['ADMIN', 'USER'])


export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	balance: integer().default(0),
	role: userRole().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	isVerified: boolean("is_verified").default(false).notNull(),
	password: varchar(),
	oauthId: varchar("OauthId"),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const events = pgTable("events", {
	id: serial().primaryKey().notNull(),
	slug: varchar().notNull(),
	description: text().notNull(),
	title: varchar().notNull(),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	minBet: real("min_bet").notNull(),
	maxBet: real("max_bet").notNull(),
	quantity: integer().notNull(),
	sot: text().notNull(),
	traders: integer().default(0).notNull(),
	status: eventStatus().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("events_slug_unique").on(table.slug),
]);

export const eventParticipants = pgTable("event_participants", {
	eventId: integer("event_id").notNull(),
	userId: integer("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "event_participants_event_id_events_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "event_participants_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const otps = pgTable("otps", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	otp: varchar().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	isVerified: boolean("is_verified").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "otps_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("otps_otp_unique").on(table.otp),
]);

export const payouts = pgTable("payouts", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	amount: real().notNull(),
	status: payoutStatus().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "payouts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const portfolios = pgTable("portfolios", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	currentBalances: real("current_balances").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "portfolios_user_id_users_id_fk"
		}).onDelete("cascade"),
]);
