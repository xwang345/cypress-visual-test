import { Injectable, inject } from '@angular/core'
import {
	Resolve,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
} from '@angular/router'

import { DataStorageService } from '../shared/data-storage.service'
import { RecipeVideoService } from './recipe-video.service'

@Injectable({ providedIn: 'root' })
export class RecipeVideoResolverService {
	constructor(
		private dataStorageService: DataStorageService,
		private recipeVideoService: RecipeVideoService,
	) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const recipeVideos = this.recipeVideoService.getRecipeVideos()

		if (recipeVideos.length === 0) {
			// this.dataStorageService.fetchRecipesFromEdamam(route.params.label).forEach(edamamRecipes => {
			//   // console.log('edamamRecipes: ' + JSON.stringify(edamamRecipes));
			// });

			return this.dataStorageService.fetchRecipeVideoFromYoutubeByTitle(
				route.params.label,
			)
		} else {
			return recipeVideos
		}
	}
}
