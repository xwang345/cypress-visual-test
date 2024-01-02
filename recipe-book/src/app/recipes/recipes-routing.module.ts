import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipesSovlerService } from './recipes-resolver.service';
import { RecipesComponent } from './recipes.component';

const routes: Routes = [
  { path: 'recipes', 
    component: RecipesComponent, 
    canActivate: 
    [AuthGuard], 
    children: [
      { 
        path: '', 
        component: RecipeStartComponent, 
        resolve: [RecipesSovlerService]  
      },
      { path: 'new', component: RecipeEditComponent },
      { 
        path: ':id', 
        component: RecipeDetailComponent, 
        resolve: [RecipesSovlerService] 
      },
      { 
        path: ':id/edit', 
        component: RecipeEditComponent,
        resolve: [RecipesSovlerService] 
      },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {

}