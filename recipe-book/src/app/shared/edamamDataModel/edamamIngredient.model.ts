export class EdamamIngredient {
  constructor(
    public text: string, 
    public quantity: number,
    public measure: string,
    public food: string,
    public weight: number,
    public foodId: string,
    public image: string,
    public foodCategory: string) { 

  }
}
