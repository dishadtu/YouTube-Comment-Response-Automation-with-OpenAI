// youtube.js

const { google } = require('googleapis');

const youtube = google.youtube({
    version: 'v3',
    auth: 'enter-auth'
});

async function getYoutubeComments(videoId) {
    return new Promise((resolve, reject) => {
        youtube.commentThreads.list({
            part: 'snippet',
            videoId: videoId,
            maxResults: 100
        }, (err, res) => {
            if (err) reject(err);
            resolve(res.data.items);
        });
    });
}

module.exports = { getYoutubeComments };
