import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const listHighlights: (req: Request, res: Response) => Promise<void>;
export declare const createHighlight: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateHighlight: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteHighlight: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=highlight.controller.d.ts.map