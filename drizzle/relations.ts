import { relations } from "drizzle-orm/relations";
import { events, eventParticipants, users, otps, payouts, portfolios } from "./schema";

export const eventParticipantsRelations = relations(eventParticipants, ({one}) => ({
	event: one(events, {
		fields: [eventParticipants.eventId],
		references: [events.id]
	}),
	user: one(users, {
		fields: [eventParticipants.userId],
		references: [users.id]
	}),
}));

export const eventsRelations = relations(events, ({many}) => ({
	eventParticipants: many(eventParticipants),
}));

export const usersRelations = relations(users, ({many}) => ({
	eventParticipants: many(eventParticipants),
	otps: many(otps),
	payouts: many(payouts),
	portfolios: many(portfolios),
}));

export const otpsRelations = relations(otps, ({one}) => ({
	user: one(users, {
		fields: [otps.userId],
		references: [users.id]
	}),
}));

export const payoutsRelations = relations(payouts, ({one}) => ({
	user: one(users, {
		fields: [payouts.userId],
		references: [users.id]
	}),
}));

export const portfoliosRelations = relations(portfolios, ({one}) => ({
	user: one(users, {
		fields: [portfolios.userId],
		references: [users.id]
	}),
}));