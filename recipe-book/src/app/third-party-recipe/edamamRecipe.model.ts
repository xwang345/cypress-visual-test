import { EdamamIngredient } from "../shared/edamamDataModel/edamamIngredient.model";
import { EdamamTotalNutrient } from "../shared/edamamDataModel/edamamTotalNutrients.model";

export class EdamamRecipe {
  public label: string;
  public image: string;
  public url: string;
  public yield: number;
  public calories: number;
  public totalWeight: number;
  public totalTime: number;
  public ingredients: EdamamIngredient[];
  public dietLabels: string[];
  public cuisineType: string[];
  public mealType: string[];
  public dishType: string[];
  public source: string;
  public shareAs: string;
  public healthLabels: string[];
  public cautions: string[];
  public totalNutrients: EdamamTotalNutrient;

  constructor(
    label: string, 
    image: string, 
    url: string, 
    yield_: number, 
    calories: number, 
    totalWeight: number, 
    totalTime: number, 
    ingredients: EdamamIngredient[], 
    dietLabels: string[], 
    cuisineType: string[], 
    mealType: string[], 
    dishType: string[],
    source: string,
    shareAs: string,
    healthLabels: string[],
    cautions: string[],
    totalNutrients: EdamamTotalNutrient) {
      this.label = label;
      this.image = image;
      this.url = url;
      this.yield = yield_;
      this.calories = calories;
      this.totalWeight = totalWeight;
      this.totalTime = totalTime;
      this.ingredients = ingredients;
      this.dietLabels = dietLabels;
      this.cuisineType = cuisineType;
      this.mealType = mealType;
      this.dishType = dishType;
      this.source = source;
      this.shareAs = shareAs;
      this.healthLabels = healthLabels;
      this.cautions = cautions;
      this.totalNutrients = totalNutrients;
  }
}