import { z } from 'zod';
export declare const joinApplicationSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    college: z.ZodString;
    course: z.ZodString;
    year: z.ZodString;
    branch: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodString>;
    skills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    motivation: z.ZodString;
    github: z.ZodOptional<z.ZodString>;
    linkedin: z.ZodOptional<z.ZodString>;
    portfolio: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    year: string;
    skills: string[];
    college: string;
    course: string;
    motivation: string;
    phone?: string | undefined;
    branch?: string | undefined;
    github?: string | undefined;
    linkedin?: string | undefined;
    portfolio?: string | undefined;
    experience?: string | undefined;
}, {
    email: string;
    name: string;
    year: string;
    college: string;
    course: string;
    motivation: string;
    phone?: string | undefined;
    branch?: string | undefined;
    skills?: string[] | undefined;
    github?: string | undefined;
    linkedin?: string | undefined;
    portfolio?: string | undefined;
    experience?: string | undefined;
}>;
export declare const updateApplicationSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "UNDER_REVIEW", "ACCEPTED", "REJECTED"]>;
    adminNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "REJECTED" | "UNDER_REVIEW" | "ACCEPTED";
    adminNotes?: string | undefined;
}, {
    status: "PENDING" | "REJECTED" | "UNDER_REVIEW" | "ACCEPTED";
    adminNotes?: string | undefined;
}>;
export type JoinApplicationInput = z.infer<typeof joinApplicationSchema>;
//# sourceMappingURL=join.validator.d.ts.map