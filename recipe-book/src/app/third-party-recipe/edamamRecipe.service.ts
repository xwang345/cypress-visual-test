import { Injectable } from '@angular/core';
import { EdamamRecipe } from './edamamRecipe.model';
import { Subject } from 'rxjs';

@Injectable()
export class EdamamRecipeService{
  edamamRecipesChanged = new Subject<EdamamRecipe[]>();

  private edamamRecipes: EdamamRecipe[] = [];

  constructor() {}

  setEdamamRecipes(edamamRecipes: EdamamRecipe[]){ // set recipes
    console.log(`EdamamRecipeService.setEdamamRecipes() edamamRecipes: ${JSON.stringify(edamamRecipes)}`);
    this.edamamRecipes = edamamRecipes;
    this.edamamRecipesChanged.next(this.edamamRecipes.slice());
  }

  getEdamamRecipes() {
    return this.edamamRecipes.slice();
  }

  getEdamamRecipe(index: number) {
    return this.edamamRecipes[index];
  }

  getEdamamRecipeByLabel(label: string) {
    let selectedEdamamRecipes = this.edamamRecipes.find(edamamRecipe => {
      if (edamamRecipe.label.toLocaleLowerCase() === label.toLocaleLowerCase()) {
        return edamamRecipe;
      }
    });

    return selectedEdamamRecipes;
  }
} 
