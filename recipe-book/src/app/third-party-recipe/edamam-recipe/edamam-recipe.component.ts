import { Component, OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { EdamamRecipeService } from '../edamamRecipe.service';
import { DataStorageService } from '../../shared/data-storage.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FilteredRecipesService } from '../../shared/filteredRecipes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edamam-recipe',
  templateUrl: './edamam-recipe.component.html',
  styleUrl: './edamam-recipe.component.css'
})
export class EdamamRecipeComponent implements OnInit, OnDestroy {
  edamamRecipes = [];
  subscription: Subscription;
  searchQuery: string = '';
  sortRecipe: string = '';
  displayedRecipes: any[] = [];
  defaultPageSize: number = 10;
  filteredRecipes: any[] = [];

  constructor(private EdamamRecipeService: EdamamRecipeService,
    private dataStorageService: DataStorageService,
    private filteredRecipesService: FilteredRecipesService,
    private cdr: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit() {
    this.subscription = this.dataStorageService.fetchRecipesFromEdamam('chicken').subscribe(edamamRecipes => {
      this.edamamRecipes = edamamRecipes;
      this.EdamamRecipeService.setEdamamRecipes(this.edamamRecipes);
      this.updateDisplayedRecipes();
    });
  }

  navigateToRecipeDetail(recipe: any) {
    this.router.navigate(['/edamam-recipe', this.replaceSpacesWithHyphen(recipe.label)]);
  }

  replaceSpacesWithHyphen(label: string): string {
    return label.toLocaleLowerCase().replace(/\s/g, '-');
  }

  /**
   * Searches for recipes using the search query and updates the edamamRecipes property.
   */
  searchRecipes() {
    this.dataStorageService.fetchRecipesFromEdamam(this.searchQuery).subscribe(edamamRecipes => {
      this.edamamRecipes = edamamRecipes;
      // console.log('edamamRecipes: ' + JSON.stringify(edamamRecipes));
    });
  }

  /**
   * Saves the recipe by storing it using the data storage service.
   */
  onSaveRecipe() {
    this.dataStorageService.storeRecipesFromEdamam();
  }

  /**
   * Handles the page change event.
   * @param event The page event containing the new page index and page size.
   */
  pageChanged(event: PageEvent) {
    this.updateDisplayedRecipes(event.pageIndex, event.pageSize);
  }

  /**
   * Updates the displayed recipes based on the given page index and page size.
   * If no arguments are provided, it uses the default page size.
   * 
   * @param pageIndex The index of the page to display.
   * @param pageSize The number of recipes to display per page.
   */
  updateDisplayedRecipes(pageIndex = 0, pageSize = this.defaultPageSize) {
    const startIndex = pageIndex * pageSize;
    let endIndex = startIndex + pageSize;

    if(endIndex > this.edamamRecipes.length) {
      endIndex = this.edamamRecipes.length;
    }

    this.displayedRecipes = this.edamamRecipes.slice(startIndex, endIndex);
  }

  /**
    * Finds user recipes based on the specified sorting criteria.
    * @returns {boolean} True if no recipes match the sorting criteria, false otherwise.
    */
  findUserRecipes() {
    let recipeAmount: number = this.edamamRecipes.filter(recipe => {
      return recipe.label.toLocaleLowerCase().includes(this.sortRecipe.toLocaleLowerCase());
     }).length;

     return (recipeAmount === 0) ? true : false;
  }

  /**
   * Lifecycle hook that is called when the component is about to be destroyed.
   * It unsubscribes from any subscriptions to prevent memory leaks.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}