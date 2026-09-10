import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const listMembers: (req: Request, res: Response) => Promise<void>;
export declare const createMember: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateMember: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteMember: (req: AuthRequest, res: Response) => Promise<void>;
export declare const moveToAlumni: (req: AuthRequest, res: Response) => Promise<void>;
export declare const assignPresident: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAdmins: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=member.controller.d.ts.map