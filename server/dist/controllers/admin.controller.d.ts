import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getDashboardStats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAnalytics: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAuditLogs: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getNotifications: (req: AuthRequest, res: Response) => Promise<void>;
export declare const markNotificationRead: (req: AuthRequest, res: Response) => Promise<void>;
export declare const globalSearch: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map