import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from './recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeSortService {
  recipesChanged = new Subject<Recipe[]>();

  updateRecipes(recipes: Recipe[]) {
    this.recipesChanged.next(recipes);
  }
}