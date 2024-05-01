import 'dotenv/config';
import fs from 'node:fs';

export class Logger {
    private static errorLog: string;
    private static getErrorLog(): string {
        if(Logger.errorLog === undefined) {
            if(process.env.ERROR_LOG === undefined) {
                throw new Error("Error log is not configured. Add the value for ERROR_LOG environment variable.");
            }
            Logger.errorLog = process.env.ERROR_LOG!;
        }
        return Logger.errorLog;
    }

    static async toErrorLog(content: string) {
        try {
            fs.writeFile(Logger.getErrorLog(), content, _err => {});
        } catch (e) {
            throw new Error("Failed to log error.\n[INFO]" + e)
        }
    }
}