"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHighlightSchema = exports.createHighlightSchema = void 0;
const zod_1 = require("zod");
exports.createHighlightSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().optional(),
    date: zod_1.z.string().optional(),
    category: zod_1.z.enum(['Photo', 'Achievement', 'Event', 'Workshop', 'Competition', 'CTF', 'Announcement']).default('Photo'),
    featured: zod_1.z.boolean().default(false),
});
exports.updateHighlightSchema = exports.createHighlightSchema.partial();
//# sourceMappingURL=highlight.validator.js.map