import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
export declare const requireRole: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const requirePermission: (...permissions: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const hasPermission: (role: string, permission: string) => boolean;
//# sourceMappingURL=rbac.d.ts.map