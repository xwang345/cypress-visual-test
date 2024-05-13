import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { RecipeVideoService } from './recipe-video.service'
import { DataStorageService } from '../shared/data-storage.service'
import { PageEvent } from '@angular/material/paginator'
import { Router } from '@angular/router'
import { trigger, transition, style, animate } from '@angular/animations'
import { SocketIoService } from '../shared/socket.io.service'

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
	defaultPageSize: number = 9
	channelId: string
	pageIndex = 0 // Default page index
	isLoading = false
	showFirstLastButtons = true

	constructor(
		private socketIoService: SocketIoService,
		private router: Router,
	) {}

	ngOnInit() {
		// Read the defaultPageSize and pageIndex from localStorage
		const storedPageSize = localStorage.getItem('defaultPageSize')
		const storedPageIndex = localStorage.getItem('pageIndex')

		// Check if the storedPageSize exists and is a valid number
		if (storedPageSize && !isNaN(Number(storedPageSize))) {
			this.defaultPageSize = Number(storedPageSize)
		}

		// Check if the storedPageIndex exists and is a valid number
		if (storedPageIndex && !isNaN(Number(storedPageIndex))) {
			this.pageIndex = Number(storedPageIndex)
		}

		this.isLoading = true

		this.socketIoService.emitToServer('fetchAllVideosDB', 'video.video')

		this.subscription = this.socketIoService
			.listenToServer('youtubeVideosFetched')
			.subscribe((data) => {
				this.recipeVideos = data
				this.isLoading = false
				this.updateDisplayedVideo(this.pageIndex, this.defaultPageSize)
			})
	}

	searchVideosByChannelId() {
		this.socketIoService.emitToServer('fetchYouTubeVideos', this.channelId)

		this.socketIoService
			.listenToServer('youtubeVideosFetched')
			.subscribe((data) => {
				this.recipeVideos = data
				this.updateDisplayedVideo()
			})
	}

	public downloadVideoById(videoId: string) {
		this.socketIoService.emitToServer('downloadVideoById', videoId)

		this.socketIoService.listenToServer('videoDownloaded')
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
		this.defaultPageSize = event.pageSize
		this.pageIndex = event.pageIndex
		localStorage.setItem('defaultPageSize', this.defaultPageSize.toString())
		localStorage.setItem('pageIndex', this.pageIndex.toString())
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

	scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe()
		}
	}
}
