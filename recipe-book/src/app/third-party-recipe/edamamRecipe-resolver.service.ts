import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataStorageService } from '../shared/data-storage.service';
import { EdamamRecipeService } from './edamamRecipe.service';

@Injectable({ providedIn: 'root' })
export class EdamamRecipeResolverService {
    constructor(
      private dataStorageService: DataStorageService,
      private edamamRecipeService: EdamamRecipeService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const edamamRecipes = this.edamamRecipeService.getEdamamRecipes();

      if (edamamRecipes.length === 0) {
        // this.dataStorageService.fetchRecipesFromEdamam(route.params.label).forEach(edamamRecipes => {
        //   // console.log('edamamRecipes: ' + JSON.stringify(edamamRecipes));
        // });

        return this.dataStorageService.fetchRecipesFromEdamam(route.params.label);
      } else {
        return edamamRecipes;
      }
    }
}