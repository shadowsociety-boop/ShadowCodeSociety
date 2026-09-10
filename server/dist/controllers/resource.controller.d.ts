import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const listResources: (req: Request, res: Response) => Promise<void>;
export declare const getResourceBySlug: (req: Request, res: Response) => Promise<void>;
export declare const submitResource: (req: Request, res: Response) => Promise<void>;
export declare const adminListResources: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createResource: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateResource: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteResource: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listSubmissions: (req: AuthRequest, res: Response) => Promise<void>;
export declare const approveSubmission: (req: AuthRequest, res: Response) => Promise<void>;
export declare const rejectSubmission: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=resource.controller.d.ts.map