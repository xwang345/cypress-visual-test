import { Pipe, PipeTransform } from '@angular/core';
import { FilteredRecipesService } from './filteredRecipes.service'; // replace with the actual path to your service

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  constructor(private filteredRecipesService: FilteredRecipesService) { }

  transform(items: any[], searchQuery: string): any[] {
    if (!items) return []; // if items is null or undefined
    if (!searchQuery) return items; // if searchQuery is null or undefined

    searchQuery = searchQuery.toLowerCase();

    const filteredItems = items.filter(item => {
      return item.label.toLowerCase().includes(searchQuery);
    });

    this.filteredRecipesService.setFilteredRecipes(filteredItems);

    return filteredItems;
  }
}