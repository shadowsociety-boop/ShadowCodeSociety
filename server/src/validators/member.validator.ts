import { z } from 'zod';

export const createMemberSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().default('Member'),
  department: z.string().optional(),
  year: z.string().optional(),
  branch: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).default([]),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  joinYear: z.number().int().optional(),
  leaveYear: z.number().int().optional(),
  status: z.enum(['CURRENT', 'ALUMNI']).default('CURRENT'),
  order: z.number().int().default(0),
});

export const updateMemberSchema = createMemberSchema.partial();

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
