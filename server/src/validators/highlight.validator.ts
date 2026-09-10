import { z } from 'zod';

export const createHighlightSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  date: z.string().optional(),
  category: z.enum(['Photo', 'Achievement', 'Event', 'Workshop', 'Competition', 'CTF', 'Announcement']).default('Photo'),
  featured: z.boolean().default(false),
});

export const updateHighlightSchema = createHighlightSchema.partial();

export type CreateHighlightInput = z.infer<typeof createHighlightSchema>;
