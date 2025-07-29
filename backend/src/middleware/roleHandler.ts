import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/UserRoles'; // Adjust the import path as necessary

export function roleHandler(allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as { role?: UserRole } | undefined;

        if (!user || !user.role) {
            return res.status(401).json({ message: 'Unauthorized: No user role found' });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }

        next();
    };
}