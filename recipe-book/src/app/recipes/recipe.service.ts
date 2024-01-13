import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { Preference } from './../shared/preference.model';

@Injectable()
export class RecipeService{
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('A Test Recipe', 
  //   'This is simply a test', 'https://www.eatingwell.com/thmb/YxkWBfh2AvNYrDKoHukRdmRvD5U=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg',
  //   [ 
  //     new Ingredient('Meat', 1), 
  //     new Ingredient('French Fries', 20) 
  //   ]),
  //   new Recipe('A Test Recipe', 
  //   'This is another simply a test', 
  //   'https://imageio.forbes.com/specials-images/imageserve/65072bc1a50c29d7592250c0/Healthy-food--Healthy-eating-background--Fruit--vegetable--berry---Vegetarian-eating-/960x0.jpg',
  //   [
  //     new Ingredient('Buns', 2),
  //     new Ingredient('Meat', 1)
  //   ])
  // ];

  private recipes: Recipe[] = [];
  private dietaryPreferences: Preference[] = [
    new Preference('All'),
    new Preference('Vegetarian'),
    new Preference('Gluten Free'),
    new Preference('Dairy Free'),
    new Preference('test'),
  ];

  constructor(private slService: ShoppingListService) {}

  setRecipes(recipes: Recipe[]){ // set recipes
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipeInstructions(index: any) {
    if (index === Number.NaN) {
      return null;
    } else {
      return this.recipes[index].instructions.slice();
    }   
  }

  getAllRecipeInstructions() {
    return this.recipes.map(recipe => recipe.instructions);
  }
  
  updateRecipeInstructions(index: number, instructions: any) {
    this.recipes[index].instructions = instructions;
    this.recipesChanged.next(this.recipes.slice());
  }

  getDietaryPreferences() {
    return this.dietaryPreferences.slice();
  }

  getDietaryPreference(index: number) {
    return this.dietaryPreferences[index];
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  } 

  reorderRecipe(currentIndex: number, newIndex: number) {
    if (newIndex >= this.recipes.length) {
      let k = newIndex - this.recipes.length + 1;
      while (k--) {
        this.recipes.push(undefined);
      }
    }
    this.recipes.splice(newIndex, 0, this.recipes.splice(currentIndex, 1)[0]);
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1); // remove 1 element at index
    this.recipesChanged.next(this.recipes.slice());
  }
}