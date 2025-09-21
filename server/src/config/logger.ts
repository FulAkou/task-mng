import winston from "winston";

// Configuration des formats personnalisés
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint(),
);

// Configuration des transports
const transports: winston.transport[] = [];

// Console pour tous les environnements
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  }),
);

// Ajouter un fichier de log en production
if (process.env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: customFormat,
    }),
  );
  transports.push(
    new winston.transports.File({
      filename: "logs/combined.log",
      format: customFormat,
    }),
  );
}

// Créer le logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: customFormat,
  transports,
  exitOnError: false,
});

// Gestion des erreurs non capturées
logger.exceptions.handle(new winston.transports.File({ filename: "logs/exceptions.log" }));

logger.rejections.handle(new winston.transports.File({ filename: "logs/rejections.log" }));

// Méthodes utilitaires
export const logInfo = (message: string, meta?: Record<string, unknown>) => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: Error | string) => {
  logger.error(message, {
    error: typeof error === "string" ? error : error?.message,
    stack: typeof error === "object" && error ? (error as Error).stack : undefined,
  });
};

export const logWarn = (message: string, meta?: Record<string, unknown>) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: Record<string, unknown>) => {
  logger.debug(message, meta);
};
