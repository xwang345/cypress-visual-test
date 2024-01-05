import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Preference } from '../../shared/preference.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService, 
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id =+ params['id'];
      this.recipe = this.recipeService.getRecipe(this.id);
      console.log(`this.recipe: =================> ${JSON.stringify(this.recipe)}`);
    });
  }

  selectAll() {
  // this.recipe.dietaryPreferences.forEach(preference => {
  //   // preference.selected = true;
  // });
}

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
