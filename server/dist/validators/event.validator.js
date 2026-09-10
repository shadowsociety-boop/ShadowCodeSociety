"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventFormSchema = exports.eventFormFieldSchema = exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
exports.createEventSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters').max(200),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    shortDescription: zod_1.z.string().max(300).optional(),
    eventType: zod_1.z.string().min(1),
    date: zod_1.z.string().min(1, 'Date is required'),
    startTime: zod_1.z.string().optional(),
    endTime: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    mode: zod_1.z.enum(['ONLINE', 'OFFLINE', 'HYBRID']).default('OFFLINE'),
    meetingLink: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    regStart: zod_1.z.string().optional(),
    regEnd: zod_1.z.string().optional(),
    maxParticipants: zod_1.z.number().int().positive().optional(),
    status: zod_1.z.enum(['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).default('DRAFT'),
    featured: zod_1.z.boolean().default(false),
    published: zod_1.z.boolean().default(false),
});
exports.updateEventSchema = exports.createEventSchema.partial();
exports.eventFormFieldSchema = zod_1.z.object({
    id: zod_1.z.string(),
    label: zod_1.z.string().min(1),
    type: zod_1.z.enum(['text', 'email', 'phone', 'number', 'textarea', 'dropdown', 'radio', 'checkbox', 'multiselect', 'file', 'url']),
    required: zod_1.z.boolean().default(false),
    placeholder: zod_1.z.string().optional(),
    options: zod_1.z.array(zod_1.z.string()).optional(),
    order: zod_1.z.number().int().default(0),
});
exports.eventFormSchema = zod_1.z.object({
    fields: zod_1.z.array(exports.eventFormFieldSchema),
});
//# sourceMappingURL=event.validator.js.map