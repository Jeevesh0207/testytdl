import ffmpegStatic from "ffmpeg-static";
import cp from "child_process";
import { Readable, Writable } from "stream";
import { findTime } from "./findTime";

interface MergeAndDownloadOptions {
  duration: string; // Duration of the output
  audioBitrate?: string; // Optional: Bitrate for audio encoding
  videoQuality?: string; // Optional: Video quality preset
}

const mergeAndStream = (
  videoStream: Readable,
  audioStream: Readable,
  outputStream: Writable,
  options: MergeAndDownloadOptions
): void => {
  if (!ffmpegStatic) {
    throw new Error("FFmpeg binary not found");
  }

  const {
    duration,
    audioBitrate = "192k",
    videoQuality = "ultrafast",
  } = options;

  const ffmpegProcess = cp.spawn(
    ffmpegStatic,
    [
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
      "copy", // Copy video codec (no re-encoding)
      "-c:a",
      "aac", // Encode audio to AAC
      "-b:a",
      audioBitrate, // Set audio bitrate
      "-ar",
      "44100", // Set audio sample rate
      "-preset",
      videoQuality, // Set encoding preset
      "-f",
      "matroska", // Output format: Matroska (stream-friendly)
      // "-movflags",
      // "frag_keyframe+empty_moov+faststart", // Fragmented MP4 for streaming
      // "-f",
      // "mp4", // Output format: MP4

      "pipe:1", // Output to stdout (pipe 1)
    ],
    {
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"], // Manage stdio for pipes
    }
  );

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
  //     "libx264", // Re-encode video to H.264 (QuickTime compatible)
  //     "-c:a",
  //     "aac", // Encode audio to AAC
  //     "-b:a",
  //     audioBitrate, // Set audio bitrate (256k)
  //     "-ar",
  //     "44100", // Set audio sample rate
  //     "-preset",
  //     "fast", // Encoding preset for better compression
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

  // const ffmpegProcess = cp.spawn(
  //   ffmpegStatic,
  //   [
  //     "-hide_banner",
  //     "-thread_queue_size",
  //     "8192", // Larger buffer for input streams
  //     "-i",
  //     "pipe:3", // Video input
  //     "-i",
  //     "pipe:4", // Audio input
  //     "-t",
  //     duration, // Set duration
  //     "-map",
  //     "0:v", // Map video
  //     "-map",
  //     "1:a", // Map audio
  //     "-c:v",
  //     "libx264", // H.264 codec
  //     "-preset",
  //     "ultrafast", // Speed-optimized preset
  //     "-c:a",
  //     "aac", // AAC audio
  //     "-b:a",
  //     audioBitrate,
  //     "-ar",
  //     "44100",
  //     "-movflags",
  //     "frag_keyframe+empty_moov+faststart",
  //     "-threads",
  //     "4", // Explicitly set threads
  //     "-f",
  //     "mp4", // MP4 output
  //     "pipe:1", // Output to stdout
  //   ],
  //   {
  //     windowsHide: true,
  //     stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"],
  //   }
  // );

  //   const ffmpegProcess = cp.spawn(
  //     ffmpegStatic,
  //     [
  //         '-hide_banner',
  //         '-i', 'pipe:3',
  //         '-i', 'pipe:4',
  //         '-t', duration,
  //         '-map', '0:v',
  //         '-map', '1:a',
  //         '-crf', '23',
  //         '-c:v', 'copy',
  //         '-c:a', 'aac',
  //         '-b:a', '192k',
  //         '-ar', '44100',
  //         '-preset', 'ultrafast',
  //         '-f', 'matroska',
  //         'pipe:1',
  //     ],
  //     {
  //         windowsHide: true,
  //         stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"],
  //     },
  // );

  const videoInput = ffmpegProcess.stdio[3] as Writable;
  const audioInput = ffmpegProcess.stdio[4] as Writable;

  if (!videoInput || !audioInput) {
    throw new Error("Failed to create input streams");
  }

  // Forward FFmpeg errors to the console
  ffmpegProcess.stderr?.on("data", (data: Buffer) => {
    // console.error(`FFmpeg stderr: ${data.toString()}`);
    const match = data.toString().match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/);

    if (match) {
      const extractedTime = match[1];
      const timeinSec = findTime(extractedTime);
      if (timeinSec !== undefined) {
        console.log(timeinSec, duration);
        const percentage = (timeinSec / parseInt(duration)) * 100;
        console.log(percentage);
      }
    } else {
      // console.log("Time not found!");
    }
  });

  // Handle FFmpeg process exit
  ffmpegProcess.on("exit", (code: number) => {
    if (code !== 0) {
      console.error(`FFmpeg exited with code ${code}`);
    } else {
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

export default mergeAndStream;
