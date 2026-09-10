"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitResourceSchema = exports.updateResourceSchema = exports.createResourceSchema = void 0;
const zod_1 = require("zod");
exports.createResourceSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().min(10),
    author: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    externalUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    published: zod_1.z.boolean().default(true),
});
exports.updateResourceSchema = exports.createResourceSchema.partial();
exports.submitResourceSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().min(10),
    category: zod_1.z.string().min(1),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    externalUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    contributorName: zod_1.z.string().min(1),
    contributorEmail: zod_1.z.string().email(),
});
//# sourceMappingURL=resource.validator.js.map