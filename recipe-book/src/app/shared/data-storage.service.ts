import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' }) // This is the recommended way to provide a service in Angular 6 and up.
export class DataStorageService {
  constructor(
    private http: HttpClient, 
    private recipeService: RecipeService,
    private authService: AuthService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://ng-xwang345-recipe-book-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(response => {
      console.log(`DataStorageService.storeRecipes() response: ${response}`);
    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://ng-xwang345-recipe-book-default-rtdb.firebaseio.com/recipes.json')
    .pipe(map(recipes => { // map is an rxjs operator
        return recipes.map(recipe => { // map is a javascript array method
          console.log(`DataStorageService.fetchRecipes() recipe: ${JSON.stringify(recipe)}`);
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [], // if recipe.ingredients is null, then return an empty array
            instructions: recipe.instructions ? recipe.instructions : []}; // if recipe.instructions is null, then return an empty array
        });
      }),tap(recipes => {
        this.recipeService.setRecipes(recipes); // tap allows us to execute some code without changing the response data
    }));
  }
}