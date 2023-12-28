import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;

  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() { // subscribe to the startedEditing subject
    this.subscription = this.slService.startedEditing
    .subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({ // set the value of the form
          name: this.editedItem.name, 
          amount: this.editedItem.amount
        });
      }
    );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    const existingIngredient = this.slService.checkIngredientByName(value.name); // Check if ingredient already exists

    if(this.editMode) { // if in edit mode
      (existingIngredient) 
      ? this.slService.updateExisitingIngredientByName(value.name, value.amount)
      : this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    } else { // if not in edit mode 
      this.slService.addIngredient(newIngredient);
    }

    if (form.name === Ingredient.name)
    this.editMode = false; // reset edit mode
    form.reset(); // reset the form
  }

  onClrear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClrear();
  }

  checkIngredientByNameWhileTyping(name: string): boolean {
    return this.slService.checkIngredientByName(name);
  }

  onNameChange(name: string) {
    this.checkIngredientByNameWhileTyping(name) ? this.editMode = true : this.editMode = false; // if ingredient exists, set edit mode to true
  }

  ngOnDestroy() { // prevent memory leaks
    this.subscription.unsubscribe();
  } 
}
