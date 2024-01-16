import { Component, OnDestroy, OnInit } from '@angular/core';
import { EdamamRecipeService } from '../edamamRecipe.service';
import { DataStorageService } from '../../shared/data-storage.service';
import { Subscription } from 'rxjs';

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


  constructor(private EdamamRecipeService: EdamamRecipeService,
    private dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.subscription = this.dataStorageService.fetchRecipesFromEdamam('chicken').subscribe(edamamRecipes => {
      this.edamamRecipes = edamamRecipes;
      // console.log('edamamRecipes: ' + JSON.stringify(edamamRecipes));
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  searchRecipes() {
    this.dataStorageService.fetchRecipesFromEdamam(this.searchQuery).subscribe(edamamRecipes => {
      this.edamamRecipes = edamamRecipes;
      // console.log('edamamRecipes: ' + JSON.stringify(edamamRecipes));
    });
  }

  onSaveRecipe() {
    this.dataStorageService.storeRecipesFromEdamam();
  }
}