const axios = require('axios');
const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const dataService = require('./data-service.js');
const { Storage } = require('@google-cloud/storage');
const schedule = require('node-schedule');
const { json } = require('sequelize');
const cors = require('cors');
const { google } = require('googleapis');
const http = require('http');
const socketIo = require('socket.io');

// Google Cloud Storage configuration
const storage = new Storage({
  projectId: 'ng-xwang345-recipe-book',
  keyFilename: './ng-xwang345-recipe-book-0ec597c7d469.json',
});

const bucketName = 'ng-xwang345-recipe-book.appspot.com'; // Replace with your bucket name

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;
app.use(cors()); // Enable CORS

// PostgreSQL connection configuration
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'RecipeDB',
//   password: 'Xlxc101302#',
//   port: 5432,
// });

//render connection configuration
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

// Edamam API configuration
const appId = 'cfe50388'; // Replace with your App ID
const appKey = 'f24c2a0fb9f9225b0bbd32da0219c554'; // Replace with your App Key
// const ingredient = 'orange'; // Example ingredient
const from = 0; // Pagination start
const to = 1; // Pagination end

let result;
let lastVideoId = null;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.json()); // Used to parse JSON bodies

// Initialize the YouTube API client
const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyBwrUutVOfYQKaLU6AX2tKO6JilQJp1GKo' // Replace 'YOUR_API_KEY' with your actual API key
});

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

async function fetchVideoDetails(videoId) {
  const response = await youtube.videos.list({
    part: 'snippet,statistics',
    id: videoId
  });

  return response.data.items[0];
}


async function fetchAllData(tableName) {
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

// /**
//  * Inserts images into the specified database table.
//  * @param {Array<Object>} images - The array of images to be inserted.
//  * @param {string} dbTableName - The name of the database table.
//  * @returns {Promise<void>} - A promise that resolves when all images have been inserted.
//  */
// const insertImages = async (images, dbTableName) => {
//   const client = await poolRender.connect(); // Create a PostgreSQL client/connection
//   try {
//     const insertQuery = `INSERT INTO ${dbTableName} (foodid, image) VALUES ($1, $2)`;
//     const insertPromises = images.map(async ({ imageUrl, imageId }) => {
//       try {
//         await client.query('BEGIN'); // Start transaction

//         if (imageUrl) {
//           const response = await axios.get(imageUrl, {
//             responseType: 'arraybuffer',
//           });
//           const imageBuffer = response.data;

//           // Store the image in Google Cloud Storage
//           const fileName = `edamam_image/recipe_ingredient_image/${imageId}.jpg`; // Replace with the desired file name

//           const file = storage.bucket(bucketName).file(fileName);
//           await file.save(imageBuffer);

//           // Get the Google Cloud Storage URL
//           const googleImageUrl = `https://storage.cloud.google.com/${bucketName}/${fileName}`;

//           console.log(chalk.blue(`Inserting image ${googleImageUrl}`));

//           await client.query(insertQuery, [imageId, googleImageUrl]);
//         } else {
//           await client.query(insertQuery, [imageId, null]);
//         }

//         await client.query('COMMIT'); // Commit transaction
//       } catch (error) {
//         console.error(
//           `Error inserting image ${imageUrl ? imageUrl : 'with ID ' + imageId}:`,
//           error
//         );
//       }
//     });

//     await Promise.all(insertPromises);
//   } catch (error) {
//     console.error('Database error:', error);
//   } finally {
//     client.release(); // Ensure that client is always released
//   }
// };

const fetchRecipes = async (ingredient) => {
  const url = `https://api.edamam.com/search?q=${encodeURIComponent(ingredient)}&app_id=${appId}&app_key=${appKey}&from=${from}&to=${to}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Edamam:', error);
    throw error;
  }
};

const insertRecipesIntoDB = async (recipesData) => {
  const client = await poolRender.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    for (const hit of recipesData.hits) {
      let imageId;

      console.log(
        chalk.bgCyanBright(`Inserting ${hit.recipe.label} into the database...`)
      );

      const recipe = hit.recipe;
      let labelCheckQuery = 'SELECT id FROM recipes WHERE label = $1;';
      let labelCheckRes = await client.query(labelCheckQuery, [recipe.label]);

      if (labelCheckRes.rows.length === 0) {
        const response = await axios.get(recipe.image, {
          responseType: 'arraybuffer',
        });
        const imageBuffer = response.data;
        let imageName = recipe.label.replace(/\s/g, '_');
        let imageExtension =
          response.headers['content-type'] === 'image/jpeg' ? '.jpg' : '.png';

        // Store the image in Google Cloud Storage
        const fileName = `edamam_image/recipe_image/${imageName}${imageExtension}`; // Replace with the desired file name

        const file = storage.bucket(bucketName).file(fileName);
        await file.save(imageBuffer);

        // Get the Google Cloud Storage URL
        const googleImageUrl = `https://storage.cloud.google.com/${bucketName}/${fileName}`;

        // Insert into 'recipes' table
        const recipeInsertQuery = `
          INSERT INTO recipes (label, image, source, url, shareAs, yield, totalTime)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id;`;
        const recipeValues = [
          recipe.label,
          googleImageUrl,
          recipe.source,
          recipe.url,
          recipe.shareAs,
          recipe.yield,
          recipe.totalTime,
        ];
        const recipeRes = await client.query(recipeInsertQuery, recipeValues);
        const recipeId = recipeRes.rows[0].id;

        const foodIdCheckQuery = `SELECT foodid FROM images WHERE foodid = $1;`;
        const foodIdCheckRes = await client.query(foodIdCheckQuery, [recipeId]);

        if (foodIdCheckRes.rows.length === 0) {
          const imagesToInsertQuery = `INSERT INTO images ( image) VALUES ($1) RETURNING foodid ;`;
          const imagesInsertRes = await client.query(imagesToInsertQuery, [
            googleImageUrl,
          ]);

          console.log(chalk.blue(`Inserting image ${googleImageUrl}`));

          imageId = imagesInsertRes.rows[0].foodid;
        } else {
          imageId = foodIdCheckRes.rows[0].foodid;
        }

        const recipeImageInsertQuery = `INSERT INTO recipe_image (recipe_id, image_id) VALUES ($1, $2);`;
        await client.query(recipeImageInsertQuery, [recipeId, imageId]);

        //================================================================================================

        // Insert into 'ingredients' table
        for (const ingredient of recipe.ingredients) {
          let response = await axios.get(ingredient.image, {
            responseType: 'arraybuffer',
          });
          let imageBuffer = response.data;
          let imageExtension =
            response.headers['content-type'] === 'image/jpeg' ? '.jpg' : '.png';

          // Store the image in Google Cloud Storage
          let fileName = `edamam_image/recipe_ingredient_image/${ingredient.foodId}${imageExtension}`; // Replace with the desired file name

          let file = storage.bucket(bucketName).file(fileName);
          await file.save(imageBuffer);

          // Get the Google Cloud Storage URL
          const googleImageUrl = `https://storage.cloud.google.com/${bucketName}/${fileName}`;

          const ingredientInsertQuery = `
              INSERT INTO ingredients (recipe_id, text, quantity, measure, food, weight, foodCategory, foodId, image)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
          `;
          const ingredientValues = [
            recipeId,
            ingredient.text,
            ingredient.quantity,
            ingredient.measure,
            ingredient.food,
            ingredient.weight,
            ingredient.foodCategory,
            ingredient.foodId,
            googleImageUrl,
          ];

          await client.query(ingredientInsertQuery, ingredientValues);
        }

        // Insert into 'nutrients' table
        // Assume 'totalNutrients' is structured appropriately
        for (const key in recipe.totalNutrients) {
          let nutrientId;
          const nutrientCheckQuery =
            'SELECT id FROM nutrientnames WHERE nutrient_name = $1;';
          const nutrientCheckRes = await client.query(nutrientCheckQuery, [
            key,
          ]);

          if (nutrientCheckRes.rows.length === 0) {
            const nutrientInsertQuery =
              'INSERT INTO nutrientnames (nutrient_name) VALUES ($1) RETURNING id;';
            const nutrientInsertRes = await client.query(nutrientInsertQuery, [
              key,
            ]);
            nutrientId = nutrientInsertRes.rows[0].id;
          } else {
            nutrientId = nutrientCheckRes.rows[0].id;
          }

          const nutrient = recipe.totalNutrients[key];
          const nutrientInsertQuery = `
                INSERT INTO totalNutrients (recipe_id, label, quantity, unit, nutrient_id)
                VALUES ($1, $2, $3, $4, $5);
        `;
          const nutrientValues = [
            recipeId,
            nutrient.label,
            nutrient.quantity,
            nutrient.unit,
            nutrientId,
          ];
          await client.query(nutrientInsertQuery, nutrientValues);
        }

        // Insertions for dietLabels, healthLabels, etc., follow a similar pattern
        for (const label of recipe.dietLabels) {
          // First, check if the label already exists in the dietLabels table
          let labelId;
          const labelCheckQuery = 'SELECT id FROM dietLabels WHERE name = $1;';
          const labelCheckRes = await client.query(labelCheckQuery, [label]);

          if (labelCheckRes.rows.length === 0) {
            // Label doesn't exist, so insert it
            const labelInsertQuery =
              'INSERT INTO dietLabels (name) VALUES ($1) RETURNING id;';
            const labelInsertRes = await client.query(labelInsertQuery, [
              label,
            ]);
            labelId = labelInsertRes.rows[0].id;
          } else {
            // Label exists, get its id
            labelId = labelCheckRes.rows[0].id;
          }

          // Insert into linking table recipe_dietLabels
          const recipeLabelLinkInsertQuery =
            'INSERT INTO recipe_dietLabel (recipe_id, dietLabel_id) VALUES ($1, $2);';
          await client.query(recipeLabelLinkInsertQuery, [recipeId, labelId]);
        }

        // Inserting healthLabels and their relations follows a similar pattern
        for (const label of recipe.healthLabels) {
          let labelId;
          const labelCheckQuery =
            'SELECT id FROM healthLabels WHERE name = $1;';
          const labelCheckRes = await client.query(labelCheckQuery, [label]);

          if (labelCheckRes.rows.length === 0) {
            const labelInsertQuery =
              'INSERT INTO healthLabels (name) VALUES ($1) RETURNING id;';
            const labelInsertRes = await client.query(labelInsertQuery, [
              label,
            ]);
            labelId = labelInsertRes.rows[0].id;
          } else {
            labelId = labelCheckRes.rows[0].id;
          }

          const recipeLabelLinkInsertQuery =
            'INSERT INTO recipe_healthLabels (recipe_id, healthLabel_id) VALUES ($1, $2);';
          await client.query(recipeLabelLinkInsertQuery, [recipeId, labelId]);
        }

        // Inserting mealType and their relations follows a similar pattern
        for (const label of recipe.mealType) {
          let labelId;
          const labelCheckQuery = 'SELECT id FROM mealType WHERE name = $1;';
          const labelCheckRes = await client.query(labelCheckQuery, [label]);

          if (labelCheckRes.rows.length === 0) {
            const labelInsertQuery =
              'INSERT INTO mealType (name) VALUES ($1) RETURNING id;';
            const labelInsertRes = await client.query(labelInsertQuery, [
              label,
            ]);
            labelId = labelInsertRes.rows[0].id;
          } else {
            labelId = labelCheckRes.rows[0].id;
          }

          const recipeLabelLinkInsertQuery =
            'INSERT INTO recipe_mealType (recipe_id, mealType_id) VALUES ($1, $2);';
          await client.query(recipeLabelLinkInsertQuery, [recipeId, labelId]);
        }

        if (Array.isArray(recipe.dishType)) {
          // Inserting dishtype and their relations follows a similar pattern
          for (const label of recipe.dishType) {
            let labelId;
            const labelCheckQuery = 'SELECT id FROM dishTypes WHERE name = $1;';
            const labelCheckRes = await client.query(labelCheckQuery, [label]);

            if (labelCheckRes.rows.length === 0) {
              const labelInsertQuery =
                'INSERT INTO dishTypes (name) VALUES ($1) RETURNING id;';
              const labelInsertRes = await client.query(labelInsertQuery, [
                label,
              ]);
              labelId = labelInsertRes.rows[0].id;
            } else {
              labelId = labelCheckRes.rows[0].id;
            }

            const recipeLabelLinkInsertQuery =
              'INSERT INTO recipe_dishType (recipe_id, dishType_id) VALUES ($1, $2);';
            await client.query(recipeLabelLinkInsertQuery, [recipeId, labelId]);
          }
        } else {
          console.error(
            chalk.red(`${recipe.label} recipe.dishType is not an array`)
          );
        }

        // Inserting cautions and their relations follows a similar pattern
        for (const label of recipe.cautions) {
          let labelId;
          const labelCheckQuery = 'SELECT id FROM cautions WHERE name = $1;';
          const labelCheckRes = await client.query(labelCheckQuery, [label]);

          if (labelCheckRes.rows.length === 0) {
            const labelInsertQuery =
              'INSERT INTO cautions (name) VALUES ($1) RETURNING id;';
            const labelInsertRes = await client.query(labelInsertQuery, [
              label,
            ]);
            labelId = labelInsertRes.rows[0].id;
          } else {
            labelId = labelCheckRes.rows[0].id;
          }

          const recipeLabelLinkInsertQuery =
            'INSERT INTO recipe_cautions (recipe_id, caution_id) VALUES ($1, $2);';
          await client.query(recipeLabelLinkInsertQuery, [recipeId, labelId]);
        }

        // Inserting cuisinetype and their relations follows a similar pattern
        for (const label of recipe.cuisineType) {
          let labelId;
          const labelCheckQuery = 'SELECT id FROM cuisineType WHERE name = $1;';
          const labelCheckRes = await client.query(labelCheckQuery, [label]);

          if (labelCheckRes.rows.length === 0) {
            const labelInsertQuery =
              'INSERT INTO cuisineType (name) VALUES ($1) RETURNING id;';
            const labelInsertRes = await client.query(labelInsertQuery, [
              label,
            ]);
            labelId = labelInsertRes.rows[0].id;
          } else {
            labelId = labelCheckRes.rows[0].id;
          }

          const recipeLabelLinkInsertQuery =
            'INSERT INTO recipe_cuisineType (recipe_id, cuisineType_id) VALUES ($1, $2);';
          await client.query(recipeLabelLinkInsertQuery, [recipeId, labelId]);
        }
        console.log(chalk.green(`Add ${recipe.label} to the database.`));
        continue;
      } else {
        console.log(
          chalk.red(`Recipe already exists in the database: ${recipe.label}`)
        );
        continue;
      }
    }

    await client.query('COMMIT'); // Commit transaction
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error('Transaction error inserting data into PostgreSQL:', error);
    throw error;
  } finally {
    client.release();
    result = await client.query(`
    SELECT 
    r.id, r.label, r.image, r.source, r.url, r.shareas, r.yield, r.totaltime,
    string_agg(DISTINCT i.text, ', ') AS ingredients_list,
    string_agg(DISTINCT CAST(i.foodid AS VARCHAR), ', ') AS ingredients_foodid,
    string_agg(DISTINCT CAST(i.image AS VARCHAR), ', ') AS ingredients_image,
    string_agg(DISTINCT nn.nutrient_name, ', ') AS nutrient_name,
    string_agg(DISTINCT n.label || ' ' || n.quantity::text || ' ' || n.unit::text, ', ') AS nutrient_quantity 
    FROM recipes r 
    LEFT JOIN ingredients i ON r.id = i.recipe_id 
    LEFT JOIN recipe_image ri ON r.id = ri.recipe_id
    LEFT JOIN images im ON ri.image_id = im.foodid
    LEFT JOIN totalnutrients n ON r.id = n.recipe_id
    LEFT JOIN nutrientnames nn ON nn.id = n.nutrient_id
    GROUP BY r.id;
    `);
    console.log(chalk.blue(`${result.rows.length} rows in the database`)); // 'rows' contains the query results
  }
};

// const insertVideoIntoDB = async (videos) => {
//   const client = await poolRender.connect();

//   try {
//     await client.query('BEGIN'); // Start transaction

//     videos.map(async (video) => {
//       const videoCheckQuery = 'SELECT * FROM video.video WHERE video_id = $1;';
//         const videoCheckRes = await client.query(videoCheckQuery, [video.snippet.resourceId.videoId]);

//         if (videoCheckRes.rows.length === 0) {
//           const videoInsertQuery = `
//             INSERT INTO video.video (
//               video_id, 
//               title, 
//               description, 
//               published_at, 
//               channel_id, 
//               channel_title,
//               publish_time,
//               thumbnail_default_url,
//               thumbnail_default_width,
//               thumbnail_default_height,
//               thumbnail_medium_url,
//               thumbnail_medium_width,
//               thumbnail_medium_height,
//               thumbnail_high_url,
//               thumbnail_high_width,
//               thumbnail_high_height,
//               live_broadcast_content
//             )
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
//               $11, $12, $13, $14, $15, $16, $17);
//           `;
//           const videoValues = [
//             video.snippet.resourceId.videoId,
//             video.snippet.title,
//             video.snippet.description,
//             video.snippet.publishedAt,
//             video.snippet.channelId,
//             video.snippet.channelTitle,
//             video.snippet.publishTime,
//             video.snippet.thumbnails.default.url,
//             video.snippet.thumbnails.default.width,
//             video.snippet.thumbnails.default.height,
//             video.snippet.thumbnails.medium.url,
//             video.snippet.thumbnails.medium.width,
//             video.snippet.thumbnails.medium.height,
//             video.snippet.thumbnails.high.url,
//             video.snippet.thumbnails.high.width,
//             video.snippet.thumbnails.high.height,
//             video.snippet.liveBroadcastContent
//           ];
//           await client.query(videoInsertQuery, videoValues);

//           console.log(chalk.green(`Inserting ${video.snippet.resourceId.videoId} into the database...`));
//         } else {
//           console.log(chalk.red(`Video already exists in the database: ${video.snippet.resourceId.videoId}`));
//         }
//     });

//     await client.query('COMMIT'); // Commit transaction
//   } catch (error) {
//     await client.query('ROLLBACK'); // Rollback transaction on error
//     console.error('Transaction error inserting data into PostgreSQL:', error);
//     throw error;
//   } finally {
//     client.release();
//   }
// };

const insertVideoIntoDB = async (videos) => {
  const client = await poolRender.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    for (const video of videos) {
      const videoCheckQuery = 'SELECT * FROM video.video WHERE id = $1;';
      const videoCheckRes = await client.query(videoCheckQuery, [video.id]);

      if (videoCheckRes.rows.length === 0) {
        const videoInsertQuery = `
          INSERT INTO video.video (
            kind,
            etag,
            id,
            snippet
          )
          VALUES ($1, $2, $3, $4);
        `;
        const videoValues = [
          video.kind,
          video.etag,
          video.id,
          video.snippet
        ];
        await client.query(videoInsertQuery, videoValues);

        console.log(chalk.green(`Inserting ${video.snippet.resourceId.videoId} into the database...`));
        await fetchVideoDetails(video.snippet.resourceId.videoId);
      } else {
        console.log(chalk.red(`Video already exists in the database: ${video.snippet.resourceId.videoId}`));
      }
    }

    await client.query('COMMIT'); // Commit transaction
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction in case of error
    console.error('Error inserting videos into database:', error);
  } finally {
    client.release(); // Release client connection
    // Emit event when commit is done
    io.emit('commitDone', { message: 'Commit is done' });
  }
};

const retrieveVideosByTitle = async (title) => {
  const client = await poolRender.connect();
  try {
    const result = await client.query(`
    SELECT * FROM video.video WHERE title ILIKE $1;
    `, [`%${title}%`]);
    console.log(chalk.blue(`${result.rows} rows in the database`));
    return result.rows; // 'rows' contains the query results
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  } finally {
    client.release();
  }
}

const retrieveVideosByChannelId = async (channelId) => {
  const client = await poolRender.connect();
  try {
    const result = await client.query(`
    SELECT * FROM video.video WHERE channel_id = $1;
    `, [channelId]);
    return result.rows; // 'rows' contains the query results
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  } finally {
    client.release();
  }
}; 

const retrieveVideosByVideoId = async (video_id) => {
  const client = await poolRender.connect();
  try {
    const result = await client.query(`
    SELECT * FROM video.video WHERE video_id = $1;
    `, [video_id]);
    return result.rows; // 'rows' contains the query results
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  } finally {
    client.release();
  }
};

app.use('/videos', cors(), async (req, res) => {
  try {
    const videos = await fetchAllData('video.video');
    res.setHeader('Content-Type', 'application/json');
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.use('/videos/:channelId', cors(), async (req, res) => {
  const { channelId } = req.params;
  try {
    const videos = await retrieveVideosByChannelId(channelId);
    res.setHeader('Content-Type', 'application/json');
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.use('/videos/title/:title', cors(), async (req, res) => {
  const { title } = req.params;
  try {
    const videos = await retrieveVideosByTitle(title);
    res.setHeader('Content-Type', 'application/json');
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.use('/videoid/:video_id', cors(), async (req, res) => {
  const { video_id } = req.params;
  console.log(chalk.blue(video_id));
  try {
    const videos = await retrieveVideosByVideoId(video_id);
    res.setHeader('Content-Type', 'application/json');
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.use('/recipes/youtube/:channelId', cors(), async (req, res) => {
  const { channelId } = req.params;
  console.log(chalk.red(channelId));
  
  try {
    getUploadsPlaylistId(channelId)
      .then(playlistId => fetchAllVideos(playlistId))
      .then(async (videos) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(videos);
        try {
          await insertVideoIntoDB(videos); // Insert videos into the database
          console.log(chalk.bgGreenBright(`Found ${videos.length} videos.`));
          // Process the videos as needed

          // Emit an event to the frontend with the inserted videos
          io.emit('videosInserted', videos);
        } catch (error) {
          console.error('Error inserting videos into DB: ', error);
        }
      })
    .catch(error => console.error('Error: ', error));
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Socket.IO connection listener
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for fetchYouTubeVideos event
  socket.on('fetchYouTubeVideos', async (channelId) => {
    console.log(chalk.red(channelId));

    try {
      const playlistId = await getUploadsPlaylistId(channelId);
      const videos = await fetchAllVideos(playlistId);

      try {
        await insertVideoIntoDB(videos);
        console.log(chalk.bgGreenBright(`Found ${videos.length} videos.`));
        socket.emit('youtubeVideosFetched', videos); // Emit after DB insertion
      } catch (dbError) {
        console.error(chalk.bgRed(`Database error: ${dbError.message}`));
        socket.emit('youtubeVideosFetchError', dbError.message);
      }

    } catch (error) {
      console.error(chalk.bgRed(`Error: ${error.message}`));
      socket.emit('youtubeVideosFetchError', error.message);
    }
  });
});

// Route to fetch and insert recipes based on user query
app.get('/recipes/:ingredient', async (req, res) => {
  const ingredient = req.params.ingredient;

  try {
    const recipesData = await fetchRecipes(ingredient);
    if (recipesData && recipesData.hits.length > 0) {
      await insertRecipesIntoDB(recipesData);
      res.status(200).send(result.rows);
    } else {
      res.status(404).send(`No recipes found for ${ingredient}.`);
    }
  } catch (error) {
    console.error('Error:', error);
    res
      .status(500)
      .send('An error occurred while processing your request.\n\n' + error);
  }
});

app.get('/recipes/label/:label', async (req, res) => {
  const { label } = req.params;

  console.log(chalk.blue(label));

  try {
    const recipeQuery = `
    SELECT 
    r.id, r.label, r.image, r.source, r.url, r.shareas, r.yield, r.totaltime,
    string_agg(DISTINCT i.text, ', ') AS ingredients_list,
    string_agg(DISTINCT CAST(i.foodid AS VARCHAR), ', ') AS ingredients_foodid,
    string_agg(DISTINCT CAST(i.image AS VARCHAR), ', ') AS ingredients_image,
    string_agg(DISTINCT nn.nutrient_name, ', ') AS nutrient_name,
    string_agg(DISTINCT n.label || ' ' || n.quantity::text || ' ' || n.unit::text, ', ') AS nutrient_quantity 
    FROM recipes r 
    LEFT JOIN ingredients i ON r.id = i.recipe_id 
    LEFT JOIN recipe_image ri ON r.id = ri.recipe_id
    LEFT JOIN images im ON ri.image_id = im.foodid
    LEFT JOIN totalnutrients n ON r.id = n.recipe_id
    LEFT JOIN nutrientnames nn ON nn.id = n.nutrient_id
    WHERE r.label ILIKE $1
    GROUP BY r.id;
      `;
    const values = [`%${label}%`]; // '%' wildcards allow for partial matching
    const queryResult = await poolRender.query(recipeQuery, values);
    if (queryResult.rows.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.json(queryResult.rows);
    } else {
      res.status(404).send('Recipe not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(chalk.yellow(`== Express http server listening on: ${port} ==`));
  return new Promise((res, req) => {
    dataService
      .initialize()
      .then(() => {
        console.log(
          chalk.bgGreen('=====  Now can connect to the database  ====')
        );
      })
      .catch((err) => {
        console.log(chalk.bgRed(err));
      });
  });
});
