import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { SharedModule } from '../shared/shared.module'
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatChipsModule } from '@angular/material/chips'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { RecipeVideoComponent } from './recipe-video.component'
import { VideoPageComponent } from './video-page/video-page.component'

@NgModule({
	declarations: [RecipeVideoComponent, VideoPageComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		SharedModule,
		MatCardModule,
		MatInputModule,
		MatFormFieldModule,
		MatChipsModule,
		MatPaginatorModule,
		MatTableModule,
		MatButtonModule,
		MatIconModule,
	],
})
export class RecipeVideoModule {}
