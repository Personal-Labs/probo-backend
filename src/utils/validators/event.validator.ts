import { z } from "zod";

export const EventSchema = z.object({
  description: z
    .string()
    .max(255, "Description cannot exceed 255 characters")
    .min(10, "Description must be at least 10 characters"),
  title: z
    .string()
    .min(5, "title must be at least 5 characters")
    .max(50, "title must be at least 50 characters"),
  startDate: z.string(),
  endDate: z.string(),
  expiresAt: z.string(),
  minBet: z.number().min(1, "minBet must be at least 1"),
  maxBet: z.number().max(10, "maxBet must be at least 10"),
  quantity: z.number(),
  sot: z.string().optional(),
  traders: z.number(),
  status: z.enum(["active", "inactive"]),
});

export type EventSchemaType = z.infer<typeof EventSchema>;
