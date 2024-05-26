import fs from 'node:fs';
import { AppConfig } from '../../AppConfig';

export class Logger {
    private static errorLog = AppConfig.get().logging.errorLog;
    private static debugLog = AppConfig.get().logging.debugLog;
    private static getErrorLog(): string | undefined {
        if(Logger.errorLog === undefined) {
            throw new Error("Error log is not configured. Add the value for ERROR_LOG environment variable.");
        }
        return Logger.errorLog;
    }
    
    private static getDebugLog(): string | undefined {
        if(!AppConfig.get().logging.enabled) { return undefined; }
        if(Logger.debugLog === undefined) {
            throw new Error("Debug log is not configured. Add the value for DEBUG_LOG environment variable.");
        }
        return Logger.debugLog;
    }

    static toErrorLog(content: string): LogWriter {
        try {
            return new LogWriter('📛 ' + content, Logger.getErrorLog());
        } catch (e) {
            throw new Error("Failed to log error.\n[Error]" + e)
        }
    }
    
    static toDebugLog(content: string): LogWriter {
        try {
            return new LogWriter(content, Logger.getDebugLog());
        } catch (e) {
            throw new Error("Failed to log debug info.\n[Error]" + e)
        }
    }
}

class LogWriter {
    private filePath?: string;
    private data: string;

    constructor(data: string, filePath?: string) {
        this.filePath = filePath;
        this.data = (new Date()).toLocaleString() + ':  ' + data + '\n';
    }

    write(): void {
        if(this.filePath === undefined) { return; }
        try {
            fs.appendFile(this.filePath!, this.data, (err) => {
                if (err) throw err;
            }); 
        } catch (e) {
            throw new Error(`Failed to log to file ${this.filePath}.\n[ Error ]` + e)
        }
    }
}