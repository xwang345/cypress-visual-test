import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Preference } from '../../shared/preference.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit, OnDestroy{
  recipes: Recipe[] = [];
  subscription: Subscription
  preferences: Preference[]; // array of preferences
  onSelectPreferences = [];

  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    // this.subscription = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
    //   this.recipes = recipes;
    // });
    // this.recipes = this.recipeService.getRecipes();
    this.preferences = this.recipeService.getDietaryPreferences(); // get the preferences
  }

  /**
   * Handles the change event when a preference is selected or deselected.
   * @param preference - The preference object that was selected or deselected.
   */
  onSelectPreferencesChange(preference: Preference) {
    if (this.onSelectPreferences.includes(preference.value)) {
      this.onSelectPreferences = this.onSelectPreferences.filter(p => p !== preference.value);
    } else {
      this.onSelectPreferences.push(preference.value);
    }
  }

  /**
   * Navigates to the "new" route when a new recipe is created.
   */
  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
