"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fetchData_1 = require("./fetchData");
const Mix_1 = __importDefault(require("./Mix"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
// Routes
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Welcome to the TypeScript Backend!" });
});
app.post("/fetch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, resolution } = req.body;
    console.log(`Fetching video: ${link}, Resolution: ${resolution}`);
    try {
        // Fetch video and audio streams
        const response = yield (0, fetchData_1.fetchAudioVideoStreams)(link, resolution);
        // Set headers for streaming video
        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Content-Disposition", `inline; filename="${response.title}.mp4"`);
        // Start streaming video and audio
        (0, Mix_1.default)(response.videoStream, response.audioStream, res, {
            duration: response.duration,
            audioBitrate: "256k",
            videoQuality: "slow",
        });
        // Note: Do not send another response after piping data
    }
    catch (error) {
        console.error("Error fetching or streaming video:", error);
        res.status(500).json({
            msg: "An error occurred while processing the request.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}));
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = app;
