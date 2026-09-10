import { z } from 'zod';
export declare const createResourceSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    author: z.ZodString;
    category: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    externalUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    published: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    published: boolean;
    description: string;
    author: string;
    category: string;
    tags: string[];
    externalUrl?: string | undefined;
}, {
    title: string;
    description: string;
    author: string;
    category: string;
    published?: boolean | undefined;
    tags?: string[] | undefined;
    externalUrl?: string | undefined;
}>;
export declare const updateResourceSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    externalUrl: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    published: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    published?: boolean | undefined;
    description?: string | undefined;
    author?: string | undefined;
    category?: string | undefined;
    tags?: string[] | undefined;
    externalUrl?: string | undefined;
}, {
    title?: string | undefined;
    published?: boolean | undefined;
    description?: string | undefined;
    author?: string | undefined;
    category?: string | undefined;
    tags?: string[] | undefined;
    externalUrl?: string | undefined;
}>;
export declare const submitResourceSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    externalUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    contributorName: z.ZodString;
    contributorEmail: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    category: string;
    tags: string[];
    contributorName: string;
    contributorEmail: string;
    externalUrl?: string | undefined;
}, {
    title: string;
    description: string;
    category: string;
    contributorName: string;
    contributorEmail: string;
    tags?: string[] | undefined;
    externalUrl?: string | undefined;
}>;
export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type SubmitResourceInput = z.infer<typeof submitResourceSchema>;
//# sourceMappingURL=resource.validator.d.ts.map