import { z } from 'zod';

export const createResourceSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  author: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  externalUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean().default(true),
});

export const updateResourceSchema = createResourceSchema.partial();

export const submitResourceSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  externalUrl: z.string().url().optional().or(z.literal('')),
  contributorName: z.string().min(1),
  contributorEmail: z.string().email(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type SubmitResourceInput = z.infer<typeof submitResourceSchema>;
