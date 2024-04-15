import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared/shared.module'
import { AuthComponent } from './auth.component'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'
import { provideAuth, getAuth } from '@angular/fire/auth'
import { environment } from '../../environments/environment'

@NgModule({
	declarations: [AuthComponent],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild([{ path: '', component: AuthComponent }]),
		SharedModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,

		// Initialize Firebase with the firebaseConfig from the environment
		// provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
		// provideAuth(() => getAuth()),
	],
})
export class AuthModule {}
