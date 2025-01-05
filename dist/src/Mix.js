"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const child_process_1 = __importDefault(require("child_process"));
const findTime_1 = require("./findTime");
const mergeAndStream = (videoStream, audioStream, outputStream, options) => {
    var _a;
    if (!ffmpeg_static_1.default) {
        throw new Error("FFmpeg binary not found");
    }
    const { duration, audioBitrate = "192k", videoQuality = "ultrafast", } = options;
    // const ffmpegProcess = cp.spawn(
    //   ffmpegStatic,
    //   [
    //     "-hide_banner", // Suppress banner for cleaner output
    //     "-thread_queue_size",
    //     "4096", // Increase buffer for input streams
    //     "-i",
    //     "pipe:3", // Video input from stdin (pipe 3)
    //     "-i",
    //     "pipe:4", // Audio input from stdin (pipe 4)
    //     "-t",
    //     duration, // Limit the duration of the output
    //     "-map",
    //     "0:v", // Map video stream
    //     "-map",
    //     "1:a", // Map audio stream
    //     "-c:v",
    //     "copy", // Copy video codec (no re-encoding)
    //     "-c:a",
    //     "aac", // Encode audio to AAC
    //     "-b:a",
    //     audioBitrate, // Set audio bitrate
    //     "-ar",
    //     "44100", // Set audio sample rate
    //     "-preset",
    //     videoQuality, // Set encoding preset
    //     // "-f",
    //     // "matroska", // Output format: Matroska (stream-friendly)
    //     "-movflags",
    //     "frag_keyframe+empty_moov+faststart", // Fragmented MP4 for streaming
    //     "-f",
    //     "mp4", // Output format: MP4
    //     "pipe:1", // Output to stdout (pipe 1)
    //   ],
    //   {
    //     windowsHide: true,
    //     stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"], // Manage stdio for pipes
    //   }
    // );
    const ffmpegProcess = child_process_1.default.spawn(ffmpeg_static_1.default, [
        "-hide_banner", // Suppress banner for cleaner output
        "-thread_queue_size",
        "4096", // Increase buffer for input streams
        "-i",
        "pipe:3", // Video input from stdin (pipe 3)
        "-i",
        "pipe:4", // Audio input from stdin (pipe 4)
        "-t",
        duration, // Limit the duration of the output
        "-map",
        "0:v", // Map video stream
        "-map",
        "1:a", // Map audio stream
        "-c:v",
        "libx264", // Re-encode video to H.264 (QuickTime compatible)
        "-c:a",
        "aac", // Encode audio to AAC
        "-b:a",
        audioBitrate, // Set audio bitrate (256k)
        "-ar",
        "44100", // Set audio sample rate
        "-preset",
        "fast", // Encoding preset for better compression
        "-movflags",
        "frag_keyframe+empty_moov+faststart", // Fragmented MP4 for streaming
        "-f",
        "mp4", // Output format: MP4
        "pipe:1", // Output to stdout (pipe 1)
    ], {
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"], // Manage stdio for pipes
    });
    const videoInput = ffmpegProcess.stdio[3];
    const audioInput = ffmpegProcess.stdio[4];
    if (!videoInput || !audioInput) {
        throw new Error("Failed to create input streams");
    }
    // Forward FFmpeg errors to the console
    (_a = ffmpegProcess.stderr) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
        // console.error(`FFmpeg stderr: ${data.toString()}`);
        const match = data.toString().match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/);
        if (match) {
            const extractedTime = match[1];
            const timeinSec = (0, findTime_1.findTime)(extractedTime);
            if (timeinSec !== undefined) {
                console.log(timeinSec, duration);
                const percentage = (timeinSec / parseInt(duration)) * 100;
                console.log(percentage);
            }
        }
        else {
            // console.log("Time not found!");
        }
    });
    // Handle FFmpeg process exit
    ffmpegProcess.on("exit", (code) => {
        if (code !== 0) {
            console.error(`FFmpeg exited with code ${code}`);
        }
        else {
            console.log("Merge and stream completed successfully");
        }
    });
    // Pipe the merged output to the provided output stream
    ffmpegProcess.stdout.pipe(outputStream);
    // Pipe video and audio data into FFmpeg
    videoStream.pipe(videoInput);
    audioStream.pipe(audioInput);
    // Handle stream errors
    videoStream.on("error", (err) => console.error("Video stream error:", err));
    audioStream.on("error", (err) => console.error("Audio stream error:", err));
    outputStream.on("error", (err) => console.error("Output stream error:", err));
};
exports.default = mergeAndStream;
