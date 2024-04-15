import { Component } from '@angular/core'
import { AuthService } from './auth.service'

@Component({
	selector: 'google-authService',
	template: `<button (click)="signInWithGoogle()">Sign in with Google</button>`,
})
export class AppComponent {
	constructor(private authService: AuthService) {}

	signInWithGoogle() {
		// this.authService.googleSignIn()
	}
}
