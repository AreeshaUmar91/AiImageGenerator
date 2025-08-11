import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Loaded ClipDrop API Key:", process.env.CLIPDROP_API_KEY ? "✓" : "✗");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY;

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    apiKey: CLIPDROP_API_KEY ? "configured" : "missing"
  });
});

// Main image generation endpoint
app.post("/generate", async (req, res) => {
  const { prompt, style, size = "1024x1024" } = req.body;

  if (!CLIPDROP_API_KEY) {
    return res.status(500).json({ 
      error: "API key not configured. Please set CLIPDROP_API_KEY in your .env file" 
    });
  }

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    console.log(`Generating image for prompt: "${prompt}"`);
    
    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": CLIPDROP_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: prompt.trim() })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ClipDrop API error:", errorText);
      return res.status(response.status).json({ 
        error: `API call failed: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    res.json({ 
      image: `data:image/png;base64,${base64Image}`,
      prompt: prompt,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
});

// Alternative endpoint for compatibility
app.post("/generate-image", async (req, res) => {
  return app._router.handle(req, res, () => {
    // This will be handled by the /generate endpoint
  });
});

// Get available styles
app.get("/styles", (req, res) => {
  res.json({
    styles: [
      { id: "realistic", name: "Realistic", description: "Photorealistic images" },
      { id: "artistic", name: "Artistic", description: "Artistic and creative style" },
      { id: "cartoon", name: "Cartoon", description: "Cartoon and animated style" },
      { id: "abstract", name: "Abstract", description: "Abstract and conceptual" }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Something went wrong!",
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Image Generator Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🎨 API Key status: ${CLIPDROP_API_KEY ? "✓ Configured" : "✗ Missing - Please set CLIPDROP_API_KEY"}`);
});
