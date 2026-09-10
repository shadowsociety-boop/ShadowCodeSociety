"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMemberSchema = exports.createMemberSchema = void 0;
const zod_1 = require("zod");
exports.createMemberSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    role: zod_1.z.string().default('Member'),
    department: zod_1.z.string().optional(),
    year: zod_1.z.string().optional(),
    branch: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).default([]),
    github: zod_1.z.string().optional(),
    linkedin: zod_1.z.string().optional(),
    portfolio: zod_1.z.string().optional(),
    joinYear: zod_1.z.number().int().optional(),
    leaveYear: zod_1.z.number().int().optional(),
    status: zod_1.z.enum(['CURRENT', 'ALUMNI']).default('CURRENT'),
    order: zod_1.z.number().int().default(0),
});
exports.updateMemberSchema = exports.createMemberSchema.partial();
//# sourceMappingURL=member.validator.js.map