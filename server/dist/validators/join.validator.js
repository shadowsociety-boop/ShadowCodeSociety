"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationSchema = exports.joinApplicationSchema = void 0;
const zod_1 = require("zod");
exports.joinApplicationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    email: zod_1.z.string().email('Invalid email'),
    phone: zod_1.z.string().optional(),
    college: zod_1.z.string().min(1, 'College is required'),
    course: zod_1.z.string().min(1, 'Course is required'),
    year: zod_1.z.string().min(1, 'Year is required'),
    branch: zod_1.z.string().optional(),
    experience: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).default([]),
    motivation: zod_1.z.string().min(20, 'Please write at least 20 characters about why you want to join'),
    github: zod_1.z.string().optional(),
    linkedin: zod_1.z.string().optional(),
    portfolio: zod_1.z.string().optional(),
});
exports.updateApplicationSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED']),
    adminNotes: zod_1.z.string().optional(),
});
//# sourceMappingURL=join.validator.js.map