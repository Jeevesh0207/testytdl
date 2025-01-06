import ytdl from "@distube/ytdl-core";

import { agent } from "../cookie/cookie";

export const fetchAudioVideoStreams = async (
  link: string,
  resolution: string
) => {
  try {
    // Fetch video details including the duration
    const info = await ytdl.getInfo(link, { agent });
    const duration = info.videoDetails.lengthSeconds; // Duration in seconds
    const title = info.videoDetails.title;

    // Filter for video streams based on resolution
    const videoStream = ytdl(link, {
      agent, // Optional agent for network requests
      filter: (format) =>
        format.qualityLabel === resolution && // Match the resolution
        format.hasVideo &&
        !format.hasAudio, // Ensure it's video-only
    });

    // Filter for audio streams based on audio quality
    const audioStream = ytdl(link, {
      agent,
      filter: (format) =>
        format.audioQuality === "AUDIO_QUALITY_MEDIUM" && // Match the audio quality
        format.hasAudio &&
        !format.hasVideo, // Ensure it's audio-only
    });

    return { videoStream, audioStream, duration, title };
  } catch (error) {
    console.error("Error fetching video or audio streams:", error);
    throw error;
  }
};
