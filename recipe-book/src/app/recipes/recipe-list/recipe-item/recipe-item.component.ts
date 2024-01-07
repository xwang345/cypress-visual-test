import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { Recipe } from '../../recipe.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RecipeService } from '../../recipe.service';
import { Subscription } from 'rxjs';

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

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.subscription = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipeArray = recipes;
    });
    this.recipeArray = this.recipeService.getRecipes();
    console.log(`this.parentData ${this.preferences}`);
  }

  ngOnChanges(changes: SimpleChanges) {
     this.subscription = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipeArray = recipes;
    });
    this.recipeArray = this.recipeService.getRecipes();
    
    if (changes.preferences) {
      this.selectedPreference = changes.preferences.currentValue;
      this.filterRecipes();
    }
  }

  filterRecipes() {
    this.filteredRecipes = this.recipeArray.filter(recipe => 
      recipe.dietaryPreferences.includes(this.selectedPreference)
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log('RecipeItemComponent.drop() event: =========>' + event.previousIndex);
    console.log('RecipeItemComponent.drop() event: ++++++++++' + event.currentIndex);
    this.recipeService.reorderRecipe(event.previousIndex, event.currentIndex);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
