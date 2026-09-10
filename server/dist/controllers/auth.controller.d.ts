import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const login: (req: AuthRequest, res: Response) => Promise<void>;
export declare const logout: (_req: AuthRequest, res: Response) => Promise<void>;
export declare const me: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map