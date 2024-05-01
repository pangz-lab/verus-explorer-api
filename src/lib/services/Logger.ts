import fs from 'node:fs';
import { AppConfig } from '../../AppConfig';

export class Logger {
    private static errorLog: string;
    private static getErrorLog(): string {
        if(Logger.errorLog === undefined) {
            if(AppConfig.get().logging.errorLog === undefined) {
                throw new Error("Error log is not configured. Add the value for ERROR_LOG environment variable.");
            }
            Logger.errorLog = AppConfig.get().logging.errorLog;
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