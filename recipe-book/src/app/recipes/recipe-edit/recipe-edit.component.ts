import { Component, OnInit, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Preference } from '../../shared/preference.model';
import { Recipe } from '../recipe.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent implements OnInit, OnChanges{
  id: number;
  editMode = false;
  recipeForm: FormGroup
  value: string = '';
  allSelected: boolean = false;
  preferences: Preference[]; // array of preferences
  isHovering: Boolean;
  files: File[] = [];
  recipeInstructionArray: any[] = [];
  isReOrderable: boolean = false;

  constructor(private route: ActivatedRoute, 
              private recipeService: RecipeService,
              private router: Router,
              private formBuilder: FormBuilder) { 
                this.recipeForm = this.formBuilder.group({
                  instructions: this.formBuilder.array([])
                });
              }

  ngOnInit() {
    this.route.params
    .subscribe((params: Params) => {
      if (params !== undefined) {
        console.log(`params============>: ${JSON.stringify(params.id)}`);
        console.log(`type ` + typeof(params['id']));
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm(); // initialize the form


        this.recipeInstructionArray = this.recipeService.getRecipeInstructions(this.id); // get the instructions
        
        // console.log(`this.recipeInstructionArray: ${JSON.stringify(this.recipeInstructionArray)}`);
      }
    });
    this.preferences = this.recipeService.getDietaryPreferences(); // get the preferences
  }

  ngOnChanges(changes: SimpleChanges){
    //
  }

  onReOrderMode() {
    this.isReOrderable = !this.isReOrderable;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.recipeInstructionArray, event.previousIndex, event.currentIndex);
    this.recipeService.updateRecipeInstructions(this.id, this.recipeInstructionArray);
    this.recipeForm.get('instructions').setValue(this.recipeInstructionArray);
  }

  formatLabel(value: number): string {
    if (value >= 100) {
      return Math.round(value / 100) + '%';
    }

    return `${value}`;
  }

  toggleHover(event: Boolean) {
    this.isHovering = event;
  }

   onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  handleDownloadUrl(downloadUrl: string) {
    console.log(`===========================================> downloadUrl from the uploader.component.html: ${downloadUrl}`);
    this.recipeForm.get('imagePath').setValue(downloadUrl);
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
      console.log(`this.recipeForm.value: ${JSON.stringify(this.recipeForm.value)}`)
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

  onAddInstruction() { 
    const newInstruction = new FormGroup({
      'instDescription': new FormControl(null, Validators.maxLength(19999)),
      'insImagePath': new FormControl(null, Validators.required)
    });

    (<FormArray>this.recipeForm.get('instructions')).push(newInstruction); // push a new form group into the form array
    this.recipeInstructionArray.push(newInstruction.value); // push the new instruction into the recipeInstructionArray
    this.recipeForm.get('dietaryPreferences').setValue(this.recipeInstructionArray); // Update the instruction form
  }

  onDeleteIngredient(index: number) { // delete an ingredient 
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  public initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipePreferences = []; // initialize an empty array
    let recipeIngredients = new FormArray([]); // initialize an empty array
    let recipeInstructions = new FormArray([]); // initialize an empty array

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

      // if recipe has instructions
      if(recipe['instructions']) {
        for(let instruction of recipe.instructions) {
          recipeInstructions.push( // push a new form group into the form array
            new FormGroup({
              'instDescription': new FormControl(instruction.instDescription, Validators.maxLength(19999)),
              'insImagePath': new FormControl(instruction.insImagePath, Validators.required)
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
      'ingredients': recipeIngredients,
      'instructions': recipeInstructions
    });
  }

  emptyInputField() {
    this.value = '';
  }
}
