import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError, tap } from 'rxjs/operators'
import { throwError, BehaviorSubject } from 'rxjs'
import { User } from './user.model'
import { environment } from '../../environments/environment'

export interface AuthResponseData {
	idToken: string
	email: string
	refreshToken: string
	expiresIn: string
	localId: string
	registered?: boolean
}

@Injectable({ providedIn: 'root' })
export class AuthService {
	// BehaviorSubject is a Subject that gives subscribers
	// immediate access to the previously emitted value upon subscription.
	user = new BehaviorSubject<User>(null)
	private tokenExpirationTimer: any

	constructor(
		private http: HttpClient,
		private router: Router,
	) {}

	signup(email: string, password: string) {
		return this.http
			.post<AuthResponseData>(
				`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
				{
					email: email,
					password: password,
					returnSecureToken: true,
				},
			)
			.pipe(
				catchError(this.handleError),
				tap((resData) => {
					this.handleAuthentication(
						resData.email,
						resData.localId,
						resData.idToken,
						+resData.expiresIn,
					)
				}),
			)
	}

	login(email: string, password: string) {
		return this.http
			.post<AuthResponseData>(
				`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
				{
					email: email,
					password: password,
					returnSecureToken: true,
				},
			)
			.pipe(
				catchError(this.handleError),
				tap((resData) => {
					this.handleAuthentication(
						resData.email,
						resData.localId,
						resData.idToken,
						+resData.expiresIn,
					)
				}),
			)
	}

	autoLogin() {
		const userData: {
			email: string
			id: string
			_token: string
			_tokenExpirationDate: string
		} = JSON.parse(localStorage.getItem('userData')) // get user data from local storage

		if (!userData) {
			return // if user data does not exist, then return
		}

		const loadedUser = new User(
			userData.email,
			userData.id,
			userData._token,
			new Date(userData._tokenExpirationDate),
		)

		if (loadedUser.token) {
			// if token exists
			this.user.next(loadedUser) // emit the user
			this.autoLogout(
				new Date(userData._tokenExpirationDate).getTime() -
					new Date().getTime(),
			) // auto logout after expiration time
		}
	}

	logout() {
		this.user.next(null)
		this.router.navigate(['/auth'])
		localStorage.removeItem('userData') // remove user data from local storage
		if (this.tokenExpirationTimer) {
			clearTimeout(this.tokenExpirationTimer)
		}
	}

	autoLogout(expirationDuration: number) {
		console.log(expirationDuration)
		this.tokenExpirationTimer = setTimeout(() => {
			this.logout()
		}, expirationDuration)
	}

	private handleAuthentication(
		email: string,
		userId: string,
		token: string,
		expiresIn: number,
	) {
		const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
		const user = new User(email, userId, token, expirationDate) // create a new user
		this.user.next(user) // emit the user
		this.autoLogout(expiresIn * 1000) // auto logout after expiration time
		localStorage.setItem('userData', JSON.stringify(user)) // store user data in local storage
	}

	private handleError(errorRes: HttpErrorResponse) {
		let errorMessage = 'An unknown error occurred!'

		if (!errorRes.error || !errorRes.error.error) {
			return throwError(errorMessage)
		}

		switch (errorRes.error.error.message) {
			case 'EMAIL_EXISTS':
				errorMessage = 'This email exists already!'
				break
			case 'EMAIL_NOT_FOUND':
				errorMessage = 'This email does not exist!'
				break
			case 'INVALID_LOGIN_CREDENTIALS':
				errorMessage = 'This password is not correct!'
				break
			case 'USER_DISABLED':
				errorMessage = 'This user is disabled!'
				break
		}

		return throwError(errorMessage)
	}
}
