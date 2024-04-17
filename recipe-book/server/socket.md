const io = require('socket.io-client');
const socket = io('http://localhost:3000'); // Adjust the URL to your server's

// socket.on('connect', () => {
// console.log('Connected to the server.');

// // Emit the fetchYouTubeVideos event with a sample channelId
// socket.emit('fetchYouTubeVideos', 'UCOQ4WrTvAoVWGKDRoUKv8rg');
// });

// // Handle the response from the server
// socket.on('youtubeVideosFetched', (videos) => {
// console.log('Videos fetched:', videos);
// });

// // Handle the error from the server
// socket.on('youtubeVideosFetchError', (errorMessage) => {
// console.error('Error fetching videos:', errorMessage);
// });

// Emit the fetchAllVideosDB event with a sample tableName
socket.on('connect', (tableName) => {
socket.emit('fetchAllVideosDB', 'video.video');
});

// Handle the response from the server
socket.on('youtubeVideosFetched', (videos) => {
console.log('Videos fetched:', videos);
});
