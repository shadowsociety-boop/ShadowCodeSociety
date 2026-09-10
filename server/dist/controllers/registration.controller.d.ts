import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const registerForEvent: (req: Request, res: Response) => Promise<void>;
export declare const listRegistrations: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateRegistration: (req: AuthRequest, res: Response) => Promise<void>;
export declare const exportRegistrations: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getRegistrationStats: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=registration.controller.d.ts.map