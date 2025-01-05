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
exports.fetchAudioVideoStreams = void 0;
const ytdl_core_1 = __importDefault(require("@distube/ytdl-core"));
const cookie_1 = require("../cookie/cookie");
const fetchAudioVideoStreams = (link, resolution) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(cookie_1.agent);
    try {
        // Fetch video details including the duration
        const info = yield ytdl_core_1.default.getInfo(link, { agent: cookie_1.agent });
        const duration = info.videoDetails.lengthSeconds; // Duration in seconds
        const title = info.videoDetails.title;
        // Filter for video streams based on resolution
        const videoStream = (0, ytdl_core_1.default)(link, {
            agent: cookie_1.agent, // Optional agent for network requests
            filter: (format) => format.qualityLabel === resolution && // Match the resolution
                format.hasVideo &&
                !format.hasAudio, // Ensure it's video-only
        });
        // Filter for audio streams based on audio quality
        const audioStream = (0, ytdl_core_1.default)(link, {
            agent: cookie_1.agent,
            filter: (format) => format.audioQuality === "AUDIO_QUALITY_MEDIUM" && // Match the audio quality
                format.hasAudio &&
                !format.hasVideo, // Ensure it's audio-only
        });
        return { videoStream, audioStream, duration, title };
    }
    catch (error) {
        console.error("Error fetching video or audio streams:", error);
        throw error;
    }
});
exports.fetchAudioVideoStreams = fetchAudioVideoStreams;
