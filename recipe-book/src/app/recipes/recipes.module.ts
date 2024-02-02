import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { RecipeEditComponent } from './recipe-edit/recipe-edit.component'
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component'
import { RecipeListComponent } from './recipe-list/recipe-list.component'
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component'
import { RecipesComponent } from './recipes.component'
import { RecipeStartComponent } from './recipe-start/recipe-start.component'
import { RecipesRoutingModule } from './recipes-routing.module'
import { BrowserModule } from '@angular/platform-browser'
import { SharedModule } from '../shared/shared.module'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { HttpClientModule } from '@angular/common/http'
import { MatMenuModule } from '@angular/material/menu'
import { MatSelectModule } from '@angular/material/select'
import { MatChipsModule } from '@angular/material/chips'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { AngularFireStorageModule } from '@angular/fire/compat/storage'
import { AngularFireModule } from '@angular/fire/compat'
import { MatCardModule } from '@angular/material/card'
import { MatTabsModule } from '@angular/material/tabs'
import { MatSliderModule } from '@angular/material/slider'
import { MatTableModule } from '@angular/material/table'

import { CdkDropList, CdkDrag } from '@angular/cdk/drag-drop'
import { UploaderComponent } from './recipe-edit/uploader/uploader.component'

@NgModule({
	declarations: [
		RecipesComponent,
		RecipeListComponent,
		RecipeDetailComponent,
		RecipeItemComponent,
		RecipeStartComponent,
		RecipeEditComponent,
		UploaderComponent,
	],
	imports: [
		BrowserModule,
		RouterModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		RecipesRoutingModule,
		SharedModule,
		MatInputModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatButtonModule,
		MatIconModule,
		MatMenuModule,
		MatSelectModule,
		MatChipsModule,
		MatProgressBarModule,
		MatCardModule,
		MatTabsModule,
		MatSliderModule,
		MatTableModule,
		AngularFireModule.initializeApp({
			apiKey: 'AIzaSyDkStIYFgEKCTV7zu8bIg_9Of53VKwIpcg',
			authDomain: 'ng-xwang345-recipe-book.firebaseapp.com',
			databaseURL:
				'https://ng-xwang345-recipe-book-default-rtdb.firebaseio.com',
			projectId: 'ng-xwang345-recipe-book',
			storageBucket: 'ng-xwang345-recipe-book.appspot.com',
			messagingSenderId: '90054152260',
			appId: '1:90054152260:web:cf3df92bf5c615355f2c11',
			measurementId: 'G-X4ZN5N9N9H',
		}),
		AngularFirestoreModule,
		AngularFireStorageModule,

		CdkDropList,
		CdkDrag,
	],
})
export class RecipesModule {}
