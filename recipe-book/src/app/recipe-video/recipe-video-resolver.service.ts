import { Injectable, inject } from '@angular/core'
import {
	Resolve,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
} from '@angular/router'

import { DataStorageService } from '../shared/data-storage.service'
import { RecipeVideoService } from './recipe-video.service'
import { SocketIoService } from '../shared/socket.io.service'

@Injectable({ providedIn: 'root' })
export class RecipeVideoResolverService {
	constructor(
		private dataStorageService: DataStorageService,
		private recipeVideoService: RecipeVideoService,
		private socketIoService: SocketIoService,
	) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const recipeVideos = this.recipeVideoService.getRecipeVideos()

		if (recipeVideos.length === 0) {
			this.socketIoService.emitToServer(
				'fetchVideoDetails',
				route.params.video_id,
			)

			return this.socketIoService.listenToServer('videoDetailsFetched')
		} else {
			return recipeVideos
		}
	}
}
