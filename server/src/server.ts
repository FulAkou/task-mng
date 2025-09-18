import app from "./app";
import { databaseService } from "./config/database";
import { logger } from "./config/logger";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connecter à la base de données
    await databaseService.connect();

    // Démarrer le serveur
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Serveur démarré sur le  http://localhost:${PORT}`);
      logger.info(`📊 Environnement: ${process.env.NODE_ENV || "development"}`);
      logger.info(`🔗 URL: http://localhost:${PORT}`);
      logger.info(`📚 API: http://localhost:${PORT}/api/v1`);
      logger.info(`💚 Santé: http://localhost:${PORT}/health`);
    });

    // Gestion de l'arrêt gracieux
    process.on("SIGTERM", () => {
      logger.info("SIGTERM reçu, arrêt gracieux du serveur...");
      server.close(async () => {
        await databaseService.disconnect();
        logger.info("Serveur arrêté avec succès");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT reçu, arrêt gracieux du serveur...");
      server.close(async () => {
        await databaseService.disconnect();
        logger.info("Serveur arrêté avec succès");
        process.exit(0);
      });
    });

    // Gestion des erreurs non capturées
    process.on("uncaughtException", (error) => {
      logger.error("Erreur non capturée:", error);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Promesse rejetée non gérée:", reason);
      process.exit(1);
    });
  } catch (error) {
    logger.error("Erreur lors du démarrage du serveur:", error);
    process.exit(1);
  }
}

// Démarrer le serveur
startServer();
