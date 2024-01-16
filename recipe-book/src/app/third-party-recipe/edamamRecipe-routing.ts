import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { EdamamRecipeComponent } from './edamam-recipe/edamam-recipe.component';
import { EdamamRecipeResolverService } from './edamamRecipe-resolver.service';

const edamamRecipeRoutes: Routes = [
  { 
    path: 'edamam-recipe', 
    component: EdamamRecipeComponent, 
    // resolve: [EdamamRecipeResolverService],
    pathMatch: 'full'
  }
];

@NgModule({
    imports: [RouterModule.forChild(edamamRecipeRoutes)],
    exports: [RouterModule]
})
 
export class EdamamRecipeRoutingModule {

}