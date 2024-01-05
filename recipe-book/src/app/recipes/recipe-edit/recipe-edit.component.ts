import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Preference } from '../../shared/preference.model';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent implements OnInit{
  id: number;
  editMode = false;
  recipeForm: FormGroup
  value: string = '';
  allSelected: boolean = false;
  preferences: Preference[]; // array of preferences

  constructor(private route: ActivatedRoute, 
              private recipeService: RecipeService,
              private router: Router) { }

  ngOnInit() {
    this.route.params
    .subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm(); // initialize the form
    });
    this.preferences = this.recipeService.getDietaryPreferences(); // get the preferences
  }

  onSubmit() {
    // const newRecipe = new Recipe( // create a new recipe
    //   this.recipeForm.value['name'], 
    //   this.recipeForm.value['description'], 
    //   this.recipeForm.value['imagePath'], 
    //   this.recipeForm.value['ingredients']
    // );

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value); // update the recipe
    } else {
      this.recipeService.addRecipe(this.recipeForm.value); // add the recipe
    }
    this.onCancel(); // navigate up one level
  } 

  onCancel() {  
    this.router.navigate(['../'], {relativeTo: this.route}); // navigate up one level
  }

  selectAll() {
    const allPreferences = this.preferences.map(preference => preference.value);
    this.recipeForm.get('dietaryPreferences').setValue(allPreferences);
    this.allSelected = true; // Set a flag to indicate that all options are selected
  }

  deselectAll() {
    this.recipeForm.get('dietaryPreferences').setValue([]);
    this.allSelected = false; // Set the flag to indicate that all options are deselected
  }

  selectAllOptions(option: string) {
    if (option === "All") {
      if (this.allSelected) {
        this.deselectAll(); // If all options are already selected, deselect them
      } else {
        this.selectAll(); // If not all options are selected, select them
      }
    } else {
      console.log("preferenceString: " + option);
    }
  }

  onAddIngredient() { 
    (<FormArray>this.recipeForm.get('ingredients')).push( // cast the form group to a form array
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required, 
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onDeleteIngredient(index: number) { // delete an ingredient 
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipePreferences = []; // initialize an empty array
    let recipeIngredients = new FormArray([]); // initialize an empty array

    if(this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipePreferences = recipe.dietaryPreferences;
      recipeDescription = recipe.description;

      // if recipe has ingredients
      if(recipe['ingredients']) {
        for(let ingredient of recipe.ingredients) {
          recipeIngredients.push( // push a new form group into the form array
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount,[
                Validators.required, 
                Validators.pattern(/^[1-9]+[0-9]*$/) // must be a number greater than 0
              ])
            })
          );
        }
      }
      
      }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'dietaryPreferences': new FormControl(recipePreferences, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  emptyInputField() {
    this.value = '';
  }
}
