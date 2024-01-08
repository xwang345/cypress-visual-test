import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingPageRoutingModule } from './setting-page.routing.module';
import { SettingPageComponent } from './setting-page.component';

@NgModule({
  declarations: [
    SettingPageComponent
  ],
  imports: [
    RouterModule,
    SettingPageRoutingModule
  ]
})
export class SettingPageModule {

}