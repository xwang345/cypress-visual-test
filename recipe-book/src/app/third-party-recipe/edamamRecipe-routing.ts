import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { EdamamRecipeComponent } from './edamam-recipe/edamam-recipe.component';
import { EdamamRecipeResolverService } from './edamamRecipe-resolver.service';
import { AuthGuard } from '../auth/auth.guard';
import { EdamamRecipeDetailComponent } from './edamam-recipe-detail/edamam-recipe-detail.component';

const edamamRecipeRoutes: Routes = [
  { 
    path: 'edamam-recipe', 
    component: EdamamRecipeComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'edamam-recipe/:label', 
    component: EdamamRecipeDetailComponent, 
    resolve: { EdamamRecipeResolverService },
    canActivate: [AuthGuard]
  },
];

@NgModule({
    imports: [RouterModule.forChild(edamamRecipeRoutes)],
    exports: [RouterModule]
})
 
export class EdamamRecipeRoutingModule {

}