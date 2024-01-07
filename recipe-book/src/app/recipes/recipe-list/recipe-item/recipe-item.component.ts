import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { Recipe } from '../../recipe.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RecipeService } from '../../recipe.service';
import { Subscription } from 'rxjs';
import { RecipeSortService } from '../../recipe-sort.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrl: './recipe-item.component.css'
})
export class RecipeItemComponent implements OnInit, OnChanges, OnDestroy {
  recipe: Recipe;
  @Input() index: number;
  @Input() preferences: string[];
  activeItemIndex: number | null = null;
  recipeArray: any;
  subscription: Subscription;
  selectedPreference: string = ''; // array of selected preference
  filteredRecipes: any[];

  constructor(private recipeService: RecipeService,
              private recipeSortService: RecipeSortService) {}

  ngOnInit() {
    this.subscription = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipeArray = recipes;
    });
    this.recipeArray = this.recipeService.getRecipes();
    console.log(`this.parentData ${this.preferences}`);
  }

  /**
   * Lifecycle hook that is called when one or more data-bound input properties of a directive change.
   * @param changes - An object containing the changed properties and their current and previous values.
   */
  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit(); // call ngOnInit to get the latest recipes
    
    if (changes.preferences) {
      this.selectedPreference = changes.preferences.currentValue;
      this.filterRecipes();
      this.recipeSortService.updateRecipes(this.filteredRecipes);
    }
  }

  filterRecipes() {
    this.filteredRecipes = this.recipeArray.filter(recipe => 
      recipe.dietaryPreferences.includes(this.selectedPreference)
    );
  }

  onDrop(event: CdkDragDrop<string[]>) {
  moveItemInArray(this.filteredRecipes, event.previousIndex, event.currentIndex);
}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
