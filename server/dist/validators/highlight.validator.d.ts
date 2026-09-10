import { z } from 'zod';
export declare const createHighlightSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    category: z.ZodDefault<z.ZodEnum<["Photo", "Achievement", "Event", "Workshop", "Competition", "CTF", "Announcement"]>>;
    featured: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    featured: boolean;
    category: "Event" | "Photo" | "Achievement" | "Workshop" | "Competition" | "CTF" | "Announcement";
    description?: string | undefined;
    date?: string | undefined;
}, {
    title: string;
    featured?: boolean | undefined;
    description?: string | undefined;
    date?: string | undefined;
    category?: "Event" | "Photo" | "Achievement" | "Workshop" | "Competition" | "CTF" | "Announcement" | undefined;
}>;
export declare const updateHighlightSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    date: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    category: z.ZodOptional<z.ZodDefault<z.ZodEnum<["Photo", "Achievement", "Event", "Workshop", "Competition", "CTF", "Announcement"]>>>;
    featured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    featured?: boolean | undefined;
    description?: string | undefined;
    date?: string | undefined;
    category?: "Event" | "Photo" | "Achievement" | "Workshop" | "Competition" | "CTF" | "Announcement" | undefined;
}, {
    title?: string | undefined;
    featured?: boolean | undefined;
    description?: string | undefined;
    date?: string | undefined;
    category?: "Event" | "Photo" | "Achievement" | "Workshop" | "Competition" | "CTF" | "Announcement" | undefined;
}>;
export type CreateHighlightInput = z.infer<typeof createHighlightSchema>;
//# sourceMappingURL=highlight.validator.d.ts.map