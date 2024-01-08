import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { SettingPageComponent } from './setting-page.component';

const routes: Routes = [
  {
    path: 'setting-page',
    component: SettingPageComponent,
    canActivate: [AuthGuard] // Add an AuthGuard to protect the route if needed
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] // Exporting RouterModule
})
export class SettingPageRoutingModule {

}
