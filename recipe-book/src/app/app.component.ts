import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None // allows global css to be applied to components
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.autoLogin();
  }
}
