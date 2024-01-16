import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchQuery: string): any[] {
    if (!items) return []; // if items is null or undefined
    if (!searchQuery) return items; // if searchQuery is null or undefined

    searchQuery = searchQuery.toLowerCase();

    return items.filter(item => {
      return item.label.toLowerCase().includes(searchQuery);
    });
  }

}