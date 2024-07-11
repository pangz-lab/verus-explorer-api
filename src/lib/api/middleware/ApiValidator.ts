import { NextFunction, Request, Response } from 'express';
import { AppConfig } from '../../../AppConfig';

export class ApiValidator {
    static checkKey(req: Request, res: Response, next: NextFunction) {
        const apiKey = req.header('x-api-key');
        if (apiKey && apiKey === AppConfig.get().localServerApiKey) {
            next();
        } else {
            res.status(401).json({ message: 'Access restricted' });
        }
    }
}