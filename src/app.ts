import express, { Request, Response } from "express";
import cors from "cors";
import { fetchAudioVideoStreams } from "./fetchData";
import mergeAndStream from "./Mix";
import { agent } from "../cookie/cookie";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ msg: "Welcome to the TypeScript Backend!" });
});

app.post("/fetch", async (req: Request, res: Response) => {
  const { link, resolution } = req.body;

  console.log(`Fetching video: ${link}, Resolution: ${resolution}`);

  try {
    // Fetch video and audio streams
    const response = await fetchAudioVideoStreams(link, resolution, agent);

    // Set headers for streaming video
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", `inline; filename="${response.title}.mp4"`);

    // Start streaming video and audio
    mergeAndStream(response.videoStream, response.audioStream, res, {
      duration: response.duration,
      audioBitrate: "256k",
      videoQuality: "slow",
    });

    // Note: Do not send another response after piping data
  } catch (error) {
    console.error("Error fetching or streaming video:", error);
    res.status(500).json({
      msg: "An error occurred while processing the request.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app