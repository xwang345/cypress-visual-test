// import express, { Request, Response } from 'express';
// import chalk from 'chalk';
// import { Pool } from 'pg';
// import axios from 'axios';

// // Assuming you have these variables defined somewhere
// declare const pool: Pool;
// declare const fetchRecipes: (ingredient: string) => Promise<any>;
// declare const insertRecipesIntoDB: (recipesData: any) => Promise<void>;
// declare const port: number;
// declare const app: express.Application;

// app.get('/recipes/:ingredient', async (req: Request, res: Response) => {
//   const { ingredient } = req.params;

//   try {
//     const recipesData = await fetchRecipes(ingredient);
//     if (recipesData && recipesData.hits.length > 0) {
//       const result = await insertRecipesIntoDB(recipesData);
//       res.status(200).send(result.rows);
//     } else {
//       res.status(404).send(`No recipes found for ${ingredient}.`);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res
//       .status(500)
//       .send('An error occurred while processing your request.\n\n' + error);
//   }
// });

// app.get('/recipes/label/:label', async (req: Request, res: Response) => {
//   const { label } = req.params;

//   console.log(chalk.blue(label));

//   try {
//     const query = `SELECT r.id, r.label, r.image, r.totaltime, r.totaltime, string_agg(i.text, ', ') AS ingredients_list, string_agg(i.image, ', ') AS ingredients_image FROM recipes r LEFT JOIN ingredients i ON r.id = i.recipe_id WHERE r.label ILIKE $1 GROUP BY r.id;
//         ;`;
//     const values = [`%${label}%`]; // '%' wildcards allow for partial matching
//     const queryResult = await pool.query(query, values);
//     if (queryResult.rows.length > 0) {
//       res.setHeader('Content-Type', 'application/json');
//       res.json(queryResult.rows);
//     } else {
//       res.status(404).send('Recipe not found');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server Error');
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(chalk.yellow('==========    System is running   =========='));
//   console.log(chalk.yellow('===                                      ==='));
//   console.log(chalk.yellow(`== Express http server listening on: ${port} ==`));
//   console.log(chalk.yellow('===                                      ==='));
//   console.log(chalk.yellow('============================================'));
// });