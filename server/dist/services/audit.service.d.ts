interface AuditEntry {
    adminId: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: string;
    ipAddress?: string;
}
export declare const auditLog: (entry: AuditEntry) => Promise<void>;
export declare const createNotification: (data: {
    title: string;
    message: string;
    type?: string;
    link?: string;
    adminId?: string;
}) => Promise<void>;
export {};
//# sourceMappingURL=audit.service.d.ts.map