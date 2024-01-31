import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { RecipeVideo } from './recipe-video.model'

@Injectable()
export class RecipeVideoService {
	recipeVideosChanged = new Subject<RecipeVideo[]>()
	private recipeVideos: RecipeVideo[] = []

	constructor() {}

	setRecipeVideos(recipeVideos: RecipeVideo[]) {
		this.recipeVideos = recipeVideos
		this.recipeVideosChanged.next(this.recipeVideos.slice())
	}

	getRecipeVideos() {
		return this.recipeVideos.slice()
	}

	getRecipeVideo(index: number) {
		return this.recipeVideos[index]
	}

	getRecipeVideoByTitle(title: string) {
		let selectedRecipeVideos = this.recipeVideos.find((recipeVideo) => {
			if (
				recipeVideo.snippet.resourceId.videoId.toLocaleLowerCase() ===
				title.toLocaleLowerCase()
			) {
				return recipeVideo
			}
		})

		return selectedRecipeVideos
	}
}
