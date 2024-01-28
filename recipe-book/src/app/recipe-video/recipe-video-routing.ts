import { Routes, RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { RecipeVideoComponent } from './recipe-video.component'
import { AuthGuard } from '../auth/auth.guard'
import { RecipeVideoResolverService } from './recipe-video-resolver.service'
import { VideoPageComponent } from './video-page/video-page.component'

const recipeVideoRoutes: Routes = [
	{
		path: 'recipe-video',
		component: RecipeVideoComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'recipe-video/:video_id',
		component: VideoPageComponent,
		resolve: { RecipeVideoResolverService },
		canActivate: [AuthGuard],
	},
]

@NgModule({
	imports: [RouterModule.forChild(recipeVideoRoutes)],
	exports: [RouterModule],
})
export class RecipeVideoRoutingModule {}
