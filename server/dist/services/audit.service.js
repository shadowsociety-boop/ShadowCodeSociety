"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.auditLog = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const auditLog = async (entry) => {
    try {
        await prisma.auditLog.create({ data: entry });
    }
    catch (error) {
        console.error('[AUDIT] Failed to create audit log:', error);
    }
};
exports.auditLog = auditLog;
const createNotification = async (data) => {
    try {
        if (data.adminId) {
            await prisma.notification.create({ data: { ...data, type: data.type || 'INFO' } });
        }
        else {
            // Send to all admins
            const admins = await prisma.admin.findMany({ select: { id: true } });
            await prisma.notification.createMany({
                data: admins.map(admin => ({
                    adminId: admin.id,
                    title: data.title,
                    message: data.message,
                    type: data.type || 'INFO',
                    link: data.link,
                })),
            });
        }
    }
    catch (error) {
        console.error('[NOTIFICATION] Failed to create notification:', error);
    }
};
exports.createNotification = createNotification;
//# sourceMappingURL=audit.service.js.map