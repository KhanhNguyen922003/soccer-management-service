/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

/**
 * Bọc hàm bất đồng bộ (async) để tự động bắt lỗi và chuyển tới middleware xử lý lỗi của Express.
 * 
 * @param fn - Hàm bất đồng bộ cần được bọc.
 * @returns Hàm middleware để xử lý yêu cầu trong Express.
 */

import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => 
    (req: Request, res: Response, next: NextFunction) => {
        // Chuyển lỗi từ hàm async đến middleware xử lý lỗi
        Promise.resolve(fn(req, res, next)).catch(next);
    }
