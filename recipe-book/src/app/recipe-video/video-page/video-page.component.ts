import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { DataStorageService } from '../../shared/data-storage.service'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

import { RecipeVideoService } from '../recipe-video.service'
import { RecipeVideo } from '../recipe-video.model'
import { SocketIoService } from '../../shared/socket.io.service'

@Component({
	selector: 'video-page',
	templateUrl: './video-page.component.html',
	styleUrls: ['./video-page.component.css'],
})
export class VideoPageComponent implements OnInit, OnDestroy {
	selectedVideo: any = null
	subscription: Subscription
	youtubeCommentsSubscription: Subscription
	video_id: string
	videoUrl: SafeResourceUrl
	commentsCount: number = 0

	constructor(
		private route: ActivatedRoute,
		private recipeVideoService: RecipeVideoService,
		private dataStorageService: DataStorageService,
		private socketIoService: SocketIoService,
		private sanitizer: DomSanitizer,
	) {}

	ngOnInit() {
		this.subscription = this.route.data.subscribe(
			(data: { RecipeVideoResolverService: any }) => {
				console.log('video details ================================')
				console.log(
					'video details ' + JSON.stringify(data.RecipeVideoResolverService),
				)
				this.selectedVideo = data.RecipeVideoResolverService

				// Here, you can update your component's state with the fetched video details
				this.video_id = this.selectedVideo.id
				this.commentsCount = this.selectedVideo.statistics.commentCount
				console.log(`this.commentsCount: ${this.commentsCount}`)
				this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
					`https://www.youtube.com/embed/${this.video_id}`,
				)
			},
		)

		this.socketIoService.emitToServerWithTwoParams(
			'fetchVideoComments',
			this.video_id,
			this.commentsCount,
		)
		this.youtubeCommentsSubscription = this.socketIoService
			.listenToServer('videoCommentsFetched')
			.subscribe((data) => {
				console.log('videoCommentsFetched: ' + JSON.stringify(data))
			})
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe()
		}
		if (this.youtubeCommentsSubscription) {
			this.youtubeCommentsSubscription.unsubscribe()
		}
	}
}
