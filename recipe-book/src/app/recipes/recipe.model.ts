import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
    public name: string;
    public description: string;
    public imagePath: string;
    public dietaryPreference: string;
    public ingredients: Ingredient[];

    constructor(name: string, description: string, imagePath: string, dietaryPreference: string, ingredients: Ingredient[]){
        this.name = name;
        this.description = description;
        this.imagePath = imagePath;
        this.dietaryPreference = dietaryPreference;
        this.ingredients = ingredients;
    }
}