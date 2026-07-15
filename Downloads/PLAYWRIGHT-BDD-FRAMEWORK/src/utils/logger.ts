const writeLog = (level: string, message: string): void => {
    process.stdout.write(`[${level}] ${message}\n`);
};

export const logStep = (message: string): void => {
    writeLog("STEP", message);
};

export const logValidation = (message: string): void => {
    writeLog("VALIDATION", message);
};

export const logInfo = (message: string): void => {
    writeLog("INFO", message);
};
