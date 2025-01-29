import { db } from "../../db";
import {
  users,
  portfolios,
  events,
  eventParticipants,
  payouts,
  otps,
} from "../../db/schema";

export async function resetTestDb() {
  await db.transaction(async (txn) => {
    await txn.delete(otps);
    await txn.delete(payouts);
    await txn.delete(eventParticipants);
    await txn.delete(events);
    await txn.delete(portfolios);
    await txn.delete(users);
  });
}
