import React from 'react';

const msToTime = ms => {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(ms / (1000 * 60));
    let hours = Math.floor(ms / (1000 * 60 * 60));
    let days = Math.floor(ms / (1000 * 60 * 60 * 24));
    if (seconds < 60) return seconds + ` second${seconds === 1 ? '' : 's'} ago`;
    else if (minutes < 60) return minutes + ` min${minutes === 1 ? '' : 's'} ago`;
    else if (hours < 24) return hours + ` hour${hours === 1 ? '' : 's'} ago`;
    else return days + ` day${days === 1 ? '' : 's'} ago`;
}

export const getPostAge = createdDateString => {
    const createDate = new Date(createdDateString);
    const currentDate = new Date();
    const timeDiff = currentDate - createDate;

    return msToTime(timeDiff);
}

