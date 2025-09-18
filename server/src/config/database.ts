// import mongoose from "mongoose";
// import { logger } from "./logger";

// export class DatabaseService {
//   private static instance: DatabaseService;
//   private isConnected = false;

//   private constructor() {}

//   static getInstance(): DatabaseService {
//     if (!DatabaseService.instance) {
//       DatabaseService.instance = new DatabaseService();
//     }
//     return DatabaseService.instance;
//   }

//   async connect(): Promise<void> {
//     if (this.isConnected) {
//       logger.info("Déjà connecté à MongoDB");
//       return;
//     }

//     try {
//       const mongoUri =
//         process.env.MONGODB_URI ||
//         "mongodb+srv://Ful49:Akou0145@cluster0.ft7ft.mongodb.net/tasksmanag?retryWrites=true&w=majority";

//       await mongoose.connect(mongoUri, {
//         maxPoolSize: 10,
//         serverSelectionTimeoutMS: 5000,
//         socketTimeoutMS: 45000,
//         bufferCommands: false,
//       });

//       this.isConnected = true;
//       logger.info("Connecté à MongoDB avec succès");

//       // Gestion des événements de connexion
//       mongoose.connection.on("error", (error) => {
//         logger.error("Erreur de connexion MongoDB:", error);
//         this.isConnected = false;
//       });

//       mongoose.connection.on("disconnected", () => {
//         logger.warn("Déconnecté de MongoDB");
//         this.isConnected = false;
//       });

//       mongoose.connection.on("reconnected", () => {
//         logger.info("Reconnecté à MongoDB");
//         this.isConnected = true;
//       });

//       // Gestion de l'arrêt gracieux
//       process.on("SIGINT", async () => {
//         await this.disconnect();
//         process.exit(0);
//       });

//       process.on("SIGTERM", async () => {
//         await this.disconnect();
//         process.exit(0);
//       });
//     } catch (error) {
//       logger.error("Erreur lors de la connexion à MongoDB:", error);
//       throw error;
//     }
//   }

//   async disconnect(): Promise<void> {
//     if (!this.isConnected) {
//       return;
//     }

//     try {
//       await mongoose.disconnect();
//       this.isConnected = false;
//       logger.info("Déconnecté de MongoDB");
//     } catch (error) {
//       logger.error("Erreur lors de la déconnexion de MongoDB:", error);
//       throw error;
//     }
//   }

//   isDatabaseConnected(): boolean {
//     return this.isConnected && mongoose.connection.readyState === 1;
//   }

//   getConnectionStatus(): string {
//     const states = {
//       0: "disconnected",
//       1: "connected",
//       2: "connecting",
//       3: "disconnecting",
//     };
//     return states[mongoose.connection.readyState] || "unknown";
//   }
// }

// export const databaseService = DatabaseService.getInstance();

import mongoose from "mongoose";

export class DatabaseService {
  private static instance: DatabaseService;
  private isConnected = false;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("ℹ️ Déjà connecté à MongoDB");
      return;
    }

    try {
      const mongoUri =
        process.env.MONGODB_URI ||
        "mongodb+srv://Ful49:Akou0145@cluster0.ft7ft.mongodb.net/tasksmanag?retryWrites=true&w=majority";

      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
      });

      this.isConnected = true;
      console.log("✅ Connecté à MongoDB avec succès");

      // Gestion des événements de connexion
      mongoose.connection.on("error", (error) => {
        console.error("❌ Erreur de connexion MongoDB:", error);
        this.isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️ Déconnecté de MongoDB");
        this.isConnected = false;
      });

      mongoose.connection.on("reconnected", () => {
        console.log("🔄 Reconnecté à MongoDB");
        this.isConnected = true;
      });

      // Gestion de l'arrêt gracieux
      process.on("SIGINT", async () => {
        await this.disconnect();
        process.exit(0);
      });

      process.on("SIGTERM", async () => {
        await this.disconnect();
        process.exit(0);
      });
    } catch (error) {
      console.error("❌ Erreur lors de la connexion à MongoDB:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("🛑 Déconnecté de MongoDB");
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion de MongoDB:", error);
      throw error;
    }
  }

  isDatabaseConnected(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  getConnectionStatus(): string {
    const states: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    return states[mongoose.connection.readyState] || "unknown";
  }
}

export const databaseService = DatabaseService.getInstance();
