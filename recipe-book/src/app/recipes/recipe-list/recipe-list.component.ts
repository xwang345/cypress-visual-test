import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
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
  selectedPreferences: string = ''; // array of selected preferences
  @Output() selectedPreferencesChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    // this.subscription = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
    //   this.recipes = recipes;
    // });
    // this.recipes = this.recipeService.getRecipes();
    this.preferences = this.recipeService.getDietaryPreferences(); // get the preferences
    this.selectedPreferences = this.preferences[0].value;
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
