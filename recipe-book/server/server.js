const axios = require('axios');
const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const dataService = require('./data-service.js');


// Initialize Express
const app = express();
const port = 3000;

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
    rejectUnauthorized: false
  }
});

// Edamam API configuration
const appId = 'cfe50388'; // Replace with your App ID
const appKey = 'f24c2a0fb9f9225b0bbd32da0219c554'; // Replace with your App Key
// const ingredient = 'orange'; // Example ingredient
const from = 0; // Pagination start
const to = 1; // Pagination end

let result;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.json()); // Used to parse JSON bodies

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

/**
 * Inserts images into the specified database table.
 * @param {Array<Object>} images - The array of images to be inserted.
 * @param {string} dbTableName - The name of the database table.
 * @returns {Promise<void>} - A promise that resolves when all images have been inserted.
 */
const insertImages = async (images, dbTableName) => {
  const client = await poolRender.connect(); // Create a PostgreSQL client/connection
  try {
    const insertQuery = `INSERT INTO ${dbTableName} (foodid, image) VALUES ($1, $2)`;
    const insertPromises = images.map(async ({ imageUrl, imageId }) => {
      try {
        await client.query('BEGIN'); // Start transaction

        if (imageUrl) {
          const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
          });
          const imageBuffer = response.data;
          await client.query(insertQuery, [imageId, imageBuffer]);
        } else {
          await client.query(insertQuery, [imageId, null]);
        }

        await client.query('COMMIT'); // Commit transaction
        console.log(
          chalk.green(
            `Image ${imageUrl ? imageUrl : 'with ID ' + imageId} has been inserted.`
          )
        );
      } catch (error) {
        console.error(
          `Error inserting image ${imageUrl ? imageUrl : 'with ID ' + imageId}:`,
          error
        );
      }
    });

    await Promise.all(insertPromises);
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    client.release(); // Ensure that client is always released
  }
};

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
      console.log(
        chalk.blue(`Inserting ${hit.recipe.label} into the database...`)
      );

      const recipe = hit.recipe;
      let labelCheckQuery = 'SELECT id FROM recipes WHERE label = $1;';
      let labelCheckRes = await client.query(labelCheckQuery, [recipe.label]);

      if (labelCheckRes.rows.length === 0) {
        // Insert into 'recipes' table
        const recipeInsertQuery = `
          INSERT INTO recipes (label, image, source, url, shareAs, yield, totalTime)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id;`;
        const recipeValues = [
          recipe.label,
          recipe.image,
          recipe.source,
          recipe.url,
          recipe.shareAs,
          recipe.yield,
          recipe.totalTime,
        ];
        const recipeRes = await client.query(recipeInsertQuery, recipeValues);
        const recipeId = recipeRes.rows[0].id;

        let imageId;

        const foodIdCheckQuery = `SELECT foodid FROM images WHERE foodid = $1;`;
        const foodIdCheckRes = await client.query(foodIdCheckQuery, [recipeId]);

        if (foodIdCheckRes.rows.length === 0) {
          const imagesToInsertQuery = `INSERT INTO images ( image) VALUES ($1) RETURNING foodid ;`;
          const response = await axios.get(recipe.image, {
            responseType: 'arraybuffer',
          });
          const imageBuffer = response.data;
          const imagesInsertRes = await client.query(imagesToInsertQuery, [
            imageBuffer,
          ]);

          imageId = imagesInsertRes.rows[0].foodid;
        } else {
          imageId = foodIdCheckRes.rows[0].foodid;
        }

        const recipeImageInsertQuery = `INSERT INTO recipe_image (recipe_id, image_id) VALUES ($1, $2);`;
        await client.query(recipeImageInsertQuery, [recipeId, imageId]);

        //================================================================================================

        // Insert into 'ingredients' table
        for (const ingredient of recipe.ingredients) {
          // Check if ingredient image already exists
          let recipeImageCheckQuery =
            'SELECT foodid FROM ingredient_image WHERE foodid = $1;';
          let recipeImageCheckRes = await client.query(recipeImageCheckQuery, [
            ingredient.foodId,
          ]);
          let imagesToInsert = {
            imageUrl: ingredient.image,
            imageId: ingredient.foodId,
          };

          if (recipeImageCheckRes.rows.length === 0) {
            // Insert ingredient image into database
            await insertImages([imagesToInsert], 'ingredient_image');
          } else {
            console.log(
              chalk.red(
                `Image ${JSON.stringify(recipeImageCheckRes.rows)}} already exists in the database.`
              )
            );
          }

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
            ingredient.image,
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
    result = await client.query(`SELECT * FROM recipes;`);
    console.log(chalk.blue(`${result.rows.length} rows in the database`)); // 'rows' contains the query results
  }
};

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
    const query = `
    SELECT 
    r.id, r.label, r.image, r.source, r.url, r.shareas, r.yield, r.totaltime,
    string_agg(DISTINCT i.text, ', ') AS ingredients_list,
    string_agg(DISTINCT i.foodid, ', ') AS ingredients_foodid,
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
    const queryResult = await poolRender.query(query, values);
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
  console.log(chalk.yellow('==========    System is running   =========='));
  console.log(chalk.yellow('===                                      ==='));
  console.log(chalk.yellow(`== Express http server listening on: ${port} ==`));
  console.log(chalk.yellow('===                                      ==='));
  console.log(chalk.yellow('============================================'));
  console.log(chalk.greenBright(`Server running on port ${port}`));
  return new Promise((res, req) => {
    dataService.initialize().then(() => {
      console.log(chalk.bgGreen("============================================"));
      console.log(chalk.bgGreen("Now can connect to the database       !!!!!!"));
      console.log(chalk.bgGreen("============================================"));
    }).catch((err) => {
      console.log(chalk.bgRed(err));
    });
  });
});
