import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { DataStorageService } from '../../shared/data-storage.service'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

import { RecipeVideoService } from '../recipe-video.service'
import { RecipeVideo } from '../recipe-video.model'

@Component({
	selector: 'video-page',
	templateUrl: './video-page.component.html',
	styleUrls: ['./video-page.component.css'],
})
export class VideoPageComponent implements OnInit, OnDestroy {
	selectedVideo: any = null
	subscription: Subscription
	video_id: string
	videoUrl: SafeResourceUrl

	constructor(
		private route: ActivatedRoute,
		private recipeVideoService: RecipeVideoService,
		private dataStorageService: DataStorageService,
		private sanitizer: DomSanitizer,
	) {}

	ngOnInit() {
		this.subscription = this.route.params.subscribe((params) => {
			console.log('params: ' + JSON.stringify(params))
			this.video_id = params.video_id
			console.log('this.videoTitle: ' + this.video_id)
			this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
				`https://www.youtube.com/embed/${this.video_id}`,
			)
		})
	}

	ngOnDestroy() {}
}
