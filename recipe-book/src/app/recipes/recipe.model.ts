import { Ingredient } from '../shared/ingredient.model';
import { Preference } from '../shared/preference.model';
import { Instruction } from '../shared/instruction.model';

export class Recipe {
    public name: string;
    public description: string;
    public imagePath: string;
    public dietaryPreferences: Preference[];
    public ingredients: Ingredient[];
    public instructions: Instruction[];

    constructor(name: string, description: string, imagePath: string, dietaryPreferences: Preference[], ingredients: Ingredient[], Instructions: Instruction[]){
        this.name = name;
        this.description = description;
        this.imagePath = imagePath;
        this.dietaryPreferences = dietaryPreferences;
        this.ingredients = ingredients;
        this.instructions = Instructions;
    }
}