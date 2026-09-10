import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(300).optional(),
  eventType: z.string().min(1),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  mode: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']).default('OFFLINE'),
  meetingLink: z.string().url().optional().or(z.literal('')),
  regStart: z.string().optional(),
  regEnd: z.string().optional(),
  maxParticipants: z.number().int().positive().optional(),
  status: z.enum(['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).default('DRAFT'),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export const updateEventSchema = createEventSchema.partial();

export const eventFormFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  type: z.enum(['text', 'email', 'phone', 'number', 'textarea', 'dropdown', 'radio', 'checkbox', 'multiselect', 'file', 'url']),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  order: z.number().int().default(0),
});

export const eventFormSchema = z.object({
  fields: z.array(eventFormFieldSchema),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventFormInput = z.infer<typeof eventFormSchema>;
