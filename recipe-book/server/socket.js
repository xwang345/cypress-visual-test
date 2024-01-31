const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { google } = require('googleapis');
const { Pool } = require('pg');
const chalk = require('chalk');
const cors = require('cors');
const { Sequelize, DataTypes, json } = require('sequelize');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');
const os = require('os');

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

//render.com connection configuration
const sequelize = new Sequelize(
  'recipedb_q8ko',
  'xwang345',
  'sXjsgyEmDEGga4IVc4G7SFgnBZmwp3I8',
  {
    host: 'dpg-cmp4bgmn7f5s73dblc20-a.oregon-postgres.render.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // You may need to set this to false depending on your database configuration
      },
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(chalk.green('Connection has been established successfully.'));
  })
  .catch((err) => {
    console.log(`Unable to connect to the database: ${err}`);
  });

// Initialize the YouTube API client
const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyBwrUutVOfYQKaLU6AX2tKO6JilQJp1GKo' // Replace 'YOUR_API_KEY' with your actual API key
});

const poolRender = new Pool({
  user: 'xwang345',
  host: 'dpg-cmp4bgmn7f5s73dblc20-a.oregon-postgres.render.com',
  database: 'recipedb_q8ko',
  password: 'sXjsgyEmDEGga4IVc4G7SFgnBZmwp3I8',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function fetchAllVideosFromDB(tableName) {
  const client = await poolRender.connect();
  try {
    const result = await client.query(`SELECT * FROM ${tableName};`);
    return result.rows; // 'rows' contains the query results
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function getUploadsPlaylistId(channelId) {
  const response = await youtube.channels.list({
    part: 'contentDetails',
    id: channelId // or use 'forUsername' if you have the channel's username
  });

  const uploadsId = response.data.items[0].contentDetails.relatedPlaylists.uploads;
  return uploadsId;
}

async function fetchAllVideos(playlistId) {
  let videos = [];
  let pageToken = null;

  do {
    const response = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: playlistId,
      maxResults: 50, // Adjust as needed
      pageToken: pageToken
    });

    videos = videos.concat(response.data.items);
    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return videos;
}

/**
 * Downloads a YouTube video.
 * @param {string} url - The URL of the YouTube video.
 * @param {string} outputPath - The path to save the downloaded video.
 */
async function downloadYouTubeVideo(url, outputPath) {
  if (!ytdl.validateURL(url)) {
      throw new Error('Invalid YouTube URL');
  }

  try {
      const video = ytdl(url, { quality: 'highestaudio' });
      video.pipe(fs.createWriteStream(outputPath));
      return new Promise((resolve, reject) => {
          video.on('end', () => resolve('Download completed.'));
          video.on('error', error => reject(`Error during download: ${error.message}`));
      });
  } catch (error) {
      throw new Error(`Failed to download video: ${error.message}`);
  }
}

/**
 * Retrieves a YouTube video by its ID.
 * @param {string} videoId - The ID of the YouTube video.
 * @returns {Promise<Object>} - A promise that resolves to the YouTube video object.
 */
async function getYoutubeVideoById(videoId) {
  const response = await youtube.videos.list({
    part: 'snippet,statistics',
    id: videoId
  });

  return response.data.items[0];
}

/**
 * Fetches comments for a given YouTube video ID.
 * @param {string} videoId - The YouTube video ID.
 */
async function fetchAllComments(videoId, maxResults) {
  try {
      const response = await youtube.commentThreads.list({
          part: 'snippet',
          videoId: videoId,
          maxResults: maxResults // Adjust as needed
      });

      const comments = response.data.items.map(item => ({
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          comment: item.snippet.topLevelComment.snippet.textDisplay
      }));

      return comments;
  } catch (error) {
      throw new Error(`Error fetching comments: ${error.message}`);
  }
}

/**
 * Get the path to the Downloads folder based on the OS.
 */
function getDownloadsFolderPath() {
  switch (os.platform()) {
      case 'win32': // Windows
          return path.join(os.homedir(), 'Downloads');
      case 'darwin': // macOS
          return path.join(os.homedir(), 'Downloads');
      default: // Linux and others
          return path.join(os.homedir(), 'Downloads');
  }
}

// const insertVideoIntoDB = async (videos) => {
//   // Start a transaction
//   const client = await poolRender.connect();

//   try {
//     await client.query('BEGIN');

//     const insertVideosQuery = `
//       INSERT INTO video.video (kind, etag, id, snippet)
//       VALUES ($1, $2, $3, $4)
//       ON CONFLICT (id) DO NOTHING
//     `;

//     // Use a single INSERT statement for all videos
//     for (const video of videos) {
//       console.log(chalk.green(`Inserting ${video.snippet.resourceId.videoId} into the database...`));
//       await client.query(insertVideosQuery, [video.kind, video.etag, video.id, video.snippet]);
//     }

//     await client.query('COMMIT');
//   } catch (error) {
//     await client.query('ROLLBACK');
//     throw error;
//   } finally {
//     client.release();
//   }
// }

const insertVideoIntoDB = async (videos) => {
  const client = await poolRender.connect();

  try {
    await client.query('BEGIN');

    // Prepare arrays for each column
    const kinds = [];
    const etags = [];
    const ids = [];
    const snippets = [];

    for (const video of videos) {
      console.log(chalk.green(`Inserting ${video.snippet.resourceId.videoId} into the database...`));
      kinds.push(video.kind);
      etags.push(video.etag);
      ids.push(video.id);
      snippets.push(JSON.stringify(video.snippet)); // Convert to JSON string
    }

    const insertVideosQuery = `
      INSERT INTO video.video (kind, etag, id, snippet)
      SELECT * FROM UNNEST($1::text[], $2::text[], $3::text[], $4::json[])
      ON CONFLICT (id) DO NOTHING
    `;

    // Bulk insert using UNNEST
    await client.query(insertVideosQuery, [kinds, etags, ids, snippets]);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

io.on("connection", (socket) => {
  console.log('A user connected');

  // Listen for fetchYouTubeVideos event
  socket.on('fetchYouTubeVideos', async (channelId) => {
    console.log(chalk.bgBlueBright(`Fetching videos for channel ID: ${channelId}`));

    try {
      const playlistId = await getUploadsPlaylistId(channelId);
      const videos = await fetchAllVideos(playlistId);

      try {
        await insertVideoIntoDB(videos);
        console.log(chalk.bgGreenBright(`Found ${videos.length} videos.`));
        const allVideos = await fetchAllVideosFromDB('video.video');
        socket.emit('youtubeVideosFetched', allVideos); // Emit after DB insertion
      } catch (dbError) {
        console.error(chalk.bgRed(`Database error: ${dbError.message}`));
        socket.emit('youtubeVideosFetchError', dbError.message);
      }

    } catch (error) {
      console.error(chalk.bgRed(`Error: ${error.message}`));
      socket.emit('youtubeVideosFetchError', error.message);
    }
  });

  // Listen for fetchAllVideosDB event
  socket.on('fetchAllVideosDB', async (tableName) => {
    console.log(chalk.bgBlueBright(`Fetching videos for table: ${tableName}`));

    try {
      const videos = await fetchAllVideosFromDB('video.video');
      console.log(chalk.bgGreenBright(`Found ${videos.length} videos.`));
      socket.emit('youtubeVideosFetched', videos); // Emit after DB insertion
    } catch (dbError) {
      console.error(chalk.bgRed(`Database error: ${dbError.message}`));
      socket.emit('youtubeVideosFetchError', dbError.message);
    }
  });

  socket.on('downloadVideoById', async (videoId) => {
    console.log(chalk.bgBlueBright(`Downloading video: ${videoId}`));

    try {
      const video = await getYoutubeVideoById(videoId);
      const downloadsFolder = getDownloadsFolderPath();
      const videoTitle = video.snippet.title.substring(0, 15).toLowerCase();
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      const videoPath = path.join(downloadsFolder, `${videoTitle}.mp4`);
      console.log(chalk.bgGreenBright(`videoPath = ${videoPath}`));

      await downloadYouTubeVideo(videoUrl, videoPath);
      socket.emit('videoDownloaded', videoPath);
    } catch (error) {
      console.error(chalk.bgRed(`Error: ${error.message}`));
      socket.emit('videoDownloadError', error.message);
    }
  });

  socket.on('fetchVideoDetails', async (videoId) => {
    console.log(chalk.bgBlueBright(`Fetching video details: ${videoId}`));

    try {
      const video = await getYoutubeVideoById(videoId);
      socket.emit('videoDetailsFetched', video);
    } catch (error) {
      console.error(chalk.bgRed(`Error: ${error.message}`));
      socket.emit('videoDetailsFetchError', error.message);
    }
  });

  socket.on('fetchVideoComments', async (videoId, maxResults) => {
    console.log(chalk.bgBlueBright(`Fetching video comments: ${videoId}`));

    try {
      const comments = await fetchAllComments(videoId, maxResults);
      console.log(chalk.green(`Found ${comments.length} comments.`));
      socket.emit('videoCommentsFetched', comments);
    } catch (error) {
      console.error(chalk.bgRed(`Error: ${error.message}`));
      socket.emit('videoCommentsFetchError', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const recipe_video = sequelize.define(
  'recipe_video',
  {
    kind: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    etag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    snippet: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    tableName: 'video',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields\
    schema: 'video',
  }
);

httpServer.listen(3000, ()=> {
  console.log(chalk.bgWhiteBright('listening on *:3000'));

  sequelize.query('CREATE SCHEMA IF NOT EXISTS video;');

  return new Promise((resolve, reject) => {
    try {
      sequelize
        .sync()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(`Unable to create table`);
        });
    } catch (err) {
      reject('Unable to create Recipes table');
    }
  });
});