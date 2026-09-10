import { z } from 'zod';
export declare const createEventSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    shortDescription: z.ZodOptional<z.ZodString>;
    eventType: z.ZodString;
    date: z.ZodString;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    mode: z.ZodDefault<z.ZodEnum<["ONLINE", "OFFLINE", "HYBRID"]>>;
    meetingLink: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    regStart: z.ZodOptional<z.ZodString>;
    regEnd: z.ZodOptional<z.ZodString>;
    maxParticipants: z.ZodOptional<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<["DRAFT", "UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]>>;
    featured: z.ZodDefault<z.ZodBoolean>;
    published: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    status: "COMPLETED" | "CANCELLED" | "UPCOMING" | "ONGOING" | "DRAFT";
    title: string;
    featured: boolean;
    published: boolean;
    eventType: string;
    description: string;
    date: string;
    mode: "ONLINE" | "OFFLINE" | "HYBRID";
    shortDescription?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
    location?: string | undefined;
    meetingLink?: string | undefined;
    regStart?: string | undefined;
    regEnd?: string | undefined;
    maxParticipants?: number | undefined;
}, {
    title: string;
    eventType: string;
    description: string;
    date: string;
    status?: "COMPLETED" | "CANCELLED" | "UPCOMING" | "ONGOING" | "DRAFT" | undefined;
    featured?: boolean | undefined;
    published?: boolean | undefined;
    shortDescription?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
    location?: string | undefined;
    mode?: "ONLINE" | "OFFLINE" | "HYBRID" | undefined;
    meetingLink?: string | undefined;
    regStart?: string | undefined;
    regEnd?: string | undefined;
    maxParticipants?: number | undefined;
}>;
export declare const updateEventSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    shortDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    eventType: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    startTime: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    endTime: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    mode: z.ZodOptional<z.ZodDefault<z.ZodEnum<["ONLINE", "OFFLINE", "HYBRID"]>>>;
    meetingLink: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    regStart: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    regEnd: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    maxParticipants: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["DRAFT", "UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]>>>;
    featured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    published: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    status?: "COMPLETED" | "CANCELLED" | "UPCOMING" | "ONGOING" | "DRAFT" | undefined;
    title?: string | undefined;
    featured?: boolean | undefined;
    published?: boolean | undefined;
    eventType?: string | undefined;
    description?: string | undefined;
    shortDescription?: string | undefined;
    date?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
    location?: string | undefined;
    mode?: "ONLINE" | "OFFLINE" | "HYBRID" | undefined;
    meetingLink?: string | undefined;
    regStart?: string | undefined;
    regEnd?: string | undefined;
    maxParticipants?: number | undefined;
}, {
    status?: "COMPLETED" | "CANCELLED" | "UPCOMING" | "ONGOING" | "DRAFT" | undefined;
    title?: string | undefined;
    featured?: boolean | undefined;
    published?: boolean | undefined;
    eventType?: string | undefined;
    description?: string | undefined;
    shortDescription?: string | undefined;
    date?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
    location?: string | undefined;
    mode?: "ONLINE" | "OFFLINE" | "HYBRID" | undefined;
    meetingLink?: string | undefined;
    regStart?: string | undefined;
    regEnd?: string | undefined;
    maxParticipants?: number | undefined;
}>;
export declare const eventFormFieldSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    type: z.ZodEnum<["text", "email", "phone", "number", "textarea", "dropdown", "radio", "checkbox", "multiselect", "file", "url"]>;
    required: z.ZodDefault<z.ZodBoolean>;
    placeholder: z.ZodOptional<z.ZodString>;
    options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    order: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "number" | "email" | "url" | "file" | "phone" | "checkbox" | "multiselect" | "dropdown" | "radio" | "text" | "textarea";
    order: number;
    label: string;
    required: boolean;
    options?: string[] | undefined;
    placeholder?: string | undefined;
}, {
    id: string;
    type: "number" | "email" | "url" | "file" | "phone" | "checkbox" | "multiselect" | "dropdown" | "radio" | "text" | "textarea";
    label: string;
    options?: string[] | undefined;
    order?: number | undefined;
    required?: boolean | undefined;
    placeholder?: string | undefined;
}>;
export declare const eventFormSchema: z.ZodObject<{
    fields: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        type: z.ZodEnum<["text", "email", "phone", "number", "textarea", "dropdown", "radio", "checkbox", "multiselect", "file", "url"]>;
        required: z.ZodDefault<z.ZodBoolean>;
        placeholder: z.ZodOptional<z.ZodString>;
        options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        order: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        type: "number" | "email" | "url" | "file" | "phone" | "checkbox" | "multiselect" | "dropdown" | "radio" | "text" | "textarea";
        order: number;
        label: string;
        required: boolean;
        options?: string[] | undefined;
        placeholder?: string | undefined;
    }, {
        id: string;
        type: "number" | "email" | "url" | "file" | "phone" | "checkbox" | "multiselect" | "dropdown" | "radio" | "text" | "textarea";
        label: string;
        options?: string[] | undefined;
        order?: number | undefined;
        required?: boolean | undefined;
        placeholder?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    fields: {
        id: string;
        type: "number" | "email" | "url" | "file" | "phone" | "checkbox" | "multiselect" | "dropdown" | "radio" | "text" | "textarea";
        order: number;
        label: string;
        required: boolean;
        options?: string[] | undefined;
        placeholder?: string | undefined;
    }[];
}, {
    fields: {
        id: string;
        type: "number" | "email" | "url" | "file" | "phone" | "checkbox" | "multiselect" | "dropdown" | "radio" | "text" | "textarea";
        label: string;
        options?: string[] | undefined;
        order?: number | undefined;
        required?: boolean | undefined;
        placeholder?: string | undefined;
    }[];
}>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventFormInput = z.infer<typeof eventFormSchema>;
//# sourceMappingURL=event.validator.d.ts.map