import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RecipeService } from '../../recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrl: './recipe-item.component.css'
})
export class RecipeItemComponent implements OnInit, OnDestroy {
  @Input() recipe: Recipe;
  @Input() index: number;
  activeItemIndex: number | null = null;
  recipeArray: Recipe[];
  subscription: Subscription

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.subscription = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipeArray = recipes;
    });
    this.recipeArray = this.recipeService.getRecipes();
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log('RecipeItemComponent.drop() event: =========>' + event.previousIndex);
    console.log('RecipeItemComponent.drop() event: ++++++++++' + event.currentIndex);
    this.recipeService.reorderRecipe(event.previousIndex, event.currentIndex);
    // moveItemInArray(this.recipeArray, event.previousIndex, event.currentIndex);
    // this.activeItemIndex = event.currentIndex;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
