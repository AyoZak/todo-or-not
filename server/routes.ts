import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { geminiService } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // Task enhancement endpoint
  app.post("/api/enhance-task", async (req, res) => {
    try {
      const { taskText, enhancementType } = req.body;
      console.log("Enhancement request:", { taskText, enhancementType });
      
      if (!taskText || !enhancementType) {
        return res.status(400).json({ error: "Missing taskText or enhancementType" });
      }

      const enhancedText = await geminiService.enhanceTask(taskText, enhancementType);
      console.log("Enhanced text:", enhancedText);
      res.json({ enhancedText });
    } catch (error) {
      console.error("Enhancement error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Enhancement failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
