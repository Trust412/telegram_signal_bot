import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

// Ensure the logs directory exists
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create a logger instance
export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    new transports.File({
      filename: path.join(logDir, "node.log"),
      maxsize: 5242880,
      maxFiles: 50,
    }), // 5MB max size, 5 max files
    new transports.Console(),
  ],
});
