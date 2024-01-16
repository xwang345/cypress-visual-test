import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { EdamamRecipeService } from '../third-party-recipe/edamamRecipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' }) // This is the recommended way to provide a service in Angular 6 and up.
export class DataStorageService {
  constructor(
    private http: HttpClient, 
    private recipeService: RecipeService,
    private EdamamRecipeService: EdamamRecipeService,
    private authService: AuthService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://ng-xwang345-recipe-book-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(response => {
      console.log(`DataStorageService.storeRecipes() response: ${response}`);
    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://ng-xwang345-recipe-book-default-rtdb.firebaseio.com/recipes.json')
      .pipe(
        map(recipes => {
          if (!recipes) {
            return []; // Return an empty array if there are no recipes
          }
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
              instructions: recipe.instructions ? recipe.instructions : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }

  fetchRecipesFromEdamam(ingredient: string) {
    const appId = 'cfe50388'; // replace with your App ID
    const appKey = 'f24c2a0fb9f9225b0bbd32da0219c554'; // replace with your App Key

    return this.http.get(`https://api.edamam.com/search?q=${ingredient}&app_id=${appId}&app_key=${appKey}`)
      .pipe(map(recipes => {
        return recipes['hits'].map(recipe => {
          console.log(`DataStorageService.fetchRecipesFromEdamam() recipe: ${JSON.stringify(recipe.recipe)}`);
          let modifiedData = recipe.recipe // recipe.recipe is an object
          console.log(`==========================================================================`);
          modifiedData.totalNutrients = Object.values(recipe.recipe.totalNutrients);
          delete modifiedData.totalDaily;
          delete modifiedData.digest;
          return modifiedData;
        });
      }), tap(recipes => {
        this.EdamamRecipeService.setEdamamRecipes(recipes);
      }));
  }

  storeRecipesFromEdamam() {
    const recipes = this.EdamamRecipeService.getEdamamRecipes();
    
    console.log(`DataStorageService.storeRecipesFromEdamam() recipes: ${JSON.stringify(recipes)}`);
    this.http.put('https://ng-xwang345-recipe-book-default-rtdb.firebaseio.com/edamamRecipes.json', recipes).subscribe(response => {
      console.log(`DataStorageService.storeRecipesFromEdamam() response: ${JSON.stringify(response)}`);
    });
  }
}