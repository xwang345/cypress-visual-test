import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppComponent } from './app.component'
import { HeaderComponent } from './header/header.component'
import { AppRoutingModule } from './app-routing.module'
import { HttpClientModule } from '@angular/common/http'
import { RecipesRoutingModule } from './recipes/recipes-routing.module'
import { ShoppingListModule } from './shopping-list/shopping-list.module'
import { RecipesModule } from './recipes/recipes.module'
import { SharedModule } from './shared/shared.module'
import { CoreModule } from './core.module'
import { AuthModule } from './auth/auth.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatMenuModule } from '@angular/material/menu'
import { MatListModule } from '@angular/material/list'
import { SettingPageModule } from './setting-page/setting-page.model'
import { EdamamRecipesModule } from './third-party-recipe/edamamRecipes.module'
import { EdamamRecipeRoutingModule } from './third-party-recipe/edamamRecipe-routing'
import { RecipeVideoModule } from './recipe-video/recipe-video.module'
import { RecipeVideoRoutingModule } from './recipe-video/recipe-video-routing'

@NgModule({
	declarations: [AppComponent, HeaderComponent],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		HttpClientModule,
		RecipesRoutingModule,
		ShoppingListModule,
		RecipesModule,
		EdamamRecipesModule,
		RecipeVideoModule,
		EdamamRecipeRoutingModule,
		RecipeVideoRoutingModule,
		SettingPageModule,
		SharedModule,
		CoreModule,
		AuthModule,
		BrowserAnimationsModule,

		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatMenuModule,
		MatListModule,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
