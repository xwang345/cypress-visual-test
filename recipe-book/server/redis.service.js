import chalk from 'chalk';
import redis from 'redis';

let client;

(async () => {
  client = redis.createClient({
    password: 'mZi7WvUInTlZty1TB85nvfca9Olg190i',
    socket: {
        host: 'redis-16878.c16.us-east-1-2.ec2.cloud.redislabs.com',
        port: 16878
    }
  });

  client.on('connect', () => {
    console.log(chalk.bgGreen('Connected to Redis'));
  });

  client.on('error', (err) => {
    console.error('Error:', err);
  });

  try {
    await client.connect();
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

export async function fetchAllVideosFromRedis() {
    try {
      let keys = await client.keys('*'); // Consider replacing with a scan iterator
      console.log(chalk.bgGreen(`Fetched keys from Redis successfully: ${keys.length} keys found`));
      let videos = await Promise.all(keys.map(async (key) => {
        let videoBuffer = await client.get(key);
        return JSON.parse(videoBuffer);
      }));
      return videos;
    } catch (err) {
      console.error(chalk.bgRed(`Error fetching videos: ${err.message}`));
      throw err; // Rethrow to allow caller to handle
    }
  }

export async function storeVideosInRedis(videos) {
  try {
    const multi = client.multi(); // Create a multi command instance

    videos.forEach((video) => {
      let videoString = JSON.stringify(video);
      let videoId = video.snippet.resourceId.videoId;

      multi.exists(videoId); // Add exists command to the multi instance
      multi.set(videoId, videoString); // Add set command to the multi instance
      multi.expire(videoId, 3600); // Add expire command to the multi instance
    });

    await multi.exec(); // Execute all commands in a single request
  } catch (err) {
    console.error(chalk.bgRed(`Error storing videos: ${err.message}`));
    throw err;
  }
}