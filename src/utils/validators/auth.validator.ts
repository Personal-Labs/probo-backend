import { z } from "zod";

const userRoleEnum = z.enum(["ADMIN", "USER"]);
export const AuthSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8),
  role: userRoleEnum,
});

export type AuthSchemaType = z.infer<typeof AuthSchema>;
