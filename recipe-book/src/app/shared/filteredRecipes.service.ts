import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilteredRecipesService {
  /**
   * Represents a private BehaviorSubject that holds an array of filtered recipes.
   */
  private filteredRecipes = new BehaviorSubject<any[]>([]); // initialize with an empty array

  setFilteredRecipes(recipes: any[]) {
    this.filteredRecipes.next(recipes);
  }

  getFilteredRecipes() {
    return this.filteredRecipes.asObservable();
  }
}