import { z } from 'zod';

export const joinApplicationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  college: z.string().min(1, 'College is required'),
  course: z.string().min(1, 'Course is required'),
  year: z.string().min(1, 'Year is required'),
  branch: z.string().optional(),
  experience: z.string().optional(),
  skills: z.array(z.string()).default([]),
  motivation: z.string().min(20, 'Please write at least 20 characters about why you want to join'),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED']),
  adminNotes: z.string().optional(),
});

export type JoinApplicationInput = z.infer<typeof joinApplicationSchema>;
