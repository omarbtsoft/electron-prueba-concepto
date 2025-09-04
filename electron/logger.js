import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const formatLog = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const context = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${context}`;
  })
);
const dailyTransport = new DailyRotateFile({
  dirname: "logs",
  filename: "node-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: false, // si quieres .gz al archivar => true
  maxSize: "20m", // opcional, límite de tamaño
  maxFiles: "14d", // opcional, días de retención
  level: "debug",
  format: formatLog,
});

const transports = [
  dailyTransport,
  new winston.transports.Console({ format: formatLog }),
];

const logger = winston.createLogger({
  level: "debug",
  transports,
  exceptionHandlers: [
    dailyTransport,
    new winston.transports.Console({ format: formatLog }),
  ],
});

logger.logWithContext = (level, message, context = {}, source = null) => {
  logger.log(level, message, { ...context, source });
};

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", { reason, promise });
});

export default logger;
