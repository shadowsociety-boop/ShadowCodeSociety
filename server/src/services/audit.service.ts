import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuditEntry {
  adminId: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
}

export const auditLog = async (entry: AuditEntry): Promise<void> => {
  try {
    await prisma.auditLog.create({ data: entry });
  } catch (error) {
    console.error('[AUDIT] Failed to create audit log:', error);
  }
};

export const createNotification = async (data: {
  title: string;
  message: string;
  type?: string;
  link?: string;
  adminId?: string;
}): Promise<void> => {
  try {
    if (data.adminId) {
      await prisma.notification.create({ data: { ...data, type: data.type || 'INFO' } });
    } else {
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
  } catch (error) {
    console.error('[NOTIFICATION] Failed to create notification:', error);
  }
};
