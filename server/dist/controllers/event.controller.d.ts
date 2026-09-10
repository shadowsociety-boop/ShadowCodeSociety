import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const listEvents: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getEventBySlug: (req: AuthRequest, res: Response) => Promise<void>;
export declare const adminListEvents: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createEvent: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateEvent: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteEvent: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getEventForm: (req: AuthRequest, res: Response) => Promise<void>;
export declare const saveEventForm: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=event.controller.d.ts.map