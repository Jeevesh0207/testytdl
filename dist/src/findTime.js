"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTime = void 0;
const findTime = (timeString) => {
    const regex = /^(\d{2}):(\d{2}):(\d{2})\.(\d{2})$/;
    // Match the time string against the regex
    const match = timeString.match(regex);
    if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);
        const milliseconds = parseInt(match[4], 10);
        // Convert to total seconds
        const totalSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 100;
        return totalSeconds;
    }
    else {
        // console.log("Invalid time format!");
    }
};
exports.findTime = findTime;
