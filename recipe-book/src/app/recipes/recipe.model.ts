import { Ingredient } from '../shared/ingredient.model';
import { Preference } from '../shared/preference.model';

export class Recipe {
    public name: string;
    public description: string;
    public imagePath: string;
    public dietaryPreferences: Preference[];
    public ingredients: Ingredient[];

    constructor(name: string, description: string, imagePath: string, dietaryPreferences: Preference[], ingredients: Ingredient[]){
        this.name = name;
        this.description = description;
        this.imagePath = imagePath;
        this.dietaryPreferences = dietaryPreferences;
        this.ingredients = ingredients;
    }
}