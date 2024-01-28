import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { RecipeVideoService } from './recipe-video.service'
import { DataStorageService } from '../shared/data-storage.service'
import { PageEvent } from '@angular/material/paginator'
import { Router } from '@angular/router'
import { trigger, transition, style, animate } from '@angular/animations'

@Component({
	selector: 'recipe-video',
	templateUrl: './recipe-video.component.html',
	styleUrls: ['./recipe-video.component.css'],
	animations: [
		trigger('slideIn', [
			transition(':enter', [
				style({ transform: 'translateX(-100%)' }),
				animate('0.5s ease-in', style({ transform: 'translateX(0)' })),
			]),
		]),
	],
})
export class RecipeVideoComponent implements OnInit, OnDestroy {
	recipeVideos = []
	subscription: Subscription
	displayedVideo: any[] = []
	defaultPageSize: number = 10

	constructor(
		private recipeVideoService: RecipeVideoService,
		private dataStorageService: DataStorageService,
		private router: Router,
	) {}

	ngOnInit() {
		this.subscription = this.dataStorageService
			.fetchAllRecipeVideos()
			.subscribe((recipeVideos: any[]) => {
				console.log('recipeVideos: ' + JSON.stringify(recipeVideos))
				this.recipeVideos = recipeVideos
				this.recipeVideoService.setRecipeVideos(this.recipeVideos)
				this.updateDisplayedVideo()
			})
	}

	navigateToVideoPage(video_id: string) {
		this.router.navigate(['/recipe-video', video_id])
	}

	/**
	 * Handles the page change event.
	 * @param event The page event containing the new page index and page size.
	 */
	pageChanged(event: PageEvent) {
		this.updateDisplayedVideo(event.pageIndex, event.pageSize)
	}

	/**
	 * Updates the displayed recipes based on the given page index and page size.
	 * If no arguments are provided, it uses the default page size.
	 *
	 * @param pageIndex The index of the page to display.
	 * @param pageSize The number of recipes to display per page.
	 */
	updateDisplayedVideo(pageIndex = 0, pageSize = this.defaultPageSize) {
		const startIndex = pageIndex * pageSize
		let endIndex = startIndex + pageSize

		if (endIndex > this.recipeVideos.length) {
			endIndex = this.recipeVideos.length
		}

		this.displayedVideo = this.recipeVideos.slice(startIndex, endIndex)
	}

	ngOnDestroy() {
		this.subscription.unsubscribe()
	}
}
