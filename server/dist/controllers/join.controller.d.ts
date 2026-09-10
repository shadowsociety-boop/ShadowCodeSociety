import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const submitApplication: (req: Request, res: Response) => Promise<void>;
export declare const listApplications: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateApplication: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getApplication: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=join.controller.d.ts.map