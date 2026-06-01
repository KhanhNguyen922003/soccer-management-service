/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { VaiTro } from "@/models/enums/vaiTro.enum";
import { DecodedToken } from "@/types/auth.types";
import { verifyToken } from "@/utils/jwt.util";
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
    user?: DecodedToken;
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token);
        if (typeof decoded === 'string') {
            res.status(401).json({ message: 'Unauthorized: Invalid token format' });
            return;
        }

        req.user = decoded as DecodedToken;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
}

export const optionalAuthenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = verifyToken(token);
            if (typeof decoded !== "string") {
                req.user = decoded as DecodedToken;
            }
        } catch (err) {
            // Nếu token sai thì bỏ qua, coi như khách
        }
    }
    next();
};


export const authorizeRoles = (allowedRoles: VaiTro[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user info' });
        }

        const { vaiTro } = req.user;
        if (!allowedRoles.includes(vaiTro)) {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }

        next();
    }
}

export function checkAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    if (req.user?.vaiTro !== "admin") {
        res.status(403).json({ message: "Chỉ admin mới được phép truy cập." });
        return;
    }
    next();
}