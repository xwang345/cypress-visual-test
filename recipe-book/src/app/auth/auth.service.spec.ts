import { TestBed } from '@angular/core/testing';
import {
	HttpClientTestingModule,
	HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, AuthResponseData } from './auth.service';
import { environment } from './../../environments/environment';

describe('AuthService', () => {
	let authService: AuthService;
	let httpMock: HttpTestingController;

	const mockResponse: AuthResponseData = {
		idToken: 'mockToken',
		email: 'test@example.com',
		refreshToken: 'mockRefreshToken',
		expiresIn: '3600',
		localId: 'mockUserId',
		registered: true,
	};

	const email = 'test@example.com';
	const password = 'password';

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [AuthService],
		}); // Configure the testbed
		authService = TestBed.inject(AuthService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		// httpMock.verify(); // Ensure no requests are outstanding
	});

	it('should signup a user', () => {
		authService.signup(email, password).subscribe((response) => {
			expect(response).toEqual(mockResponse);
		});

		const req = httpMock.expectOne(
			`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
		);

		expect(req.request.method).toBe('POST');
		expect(req.request.body).toEqual({
			email,
			password,
			returnSecureToken: true,
		});
		req.flush(mockResponse); // Return mockResponse
	});

	// Add more test cases for other methods of AuthService
	it('should login a user', () => {
		authService.login(email, password).subscribe((response) => {
			expect(response).toEqual(mockResponse);
		});

		const req = httpMock.expectOne(
			`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
		);

		expect(req.request.method).toBe('POST');
		expect(req.request.body).toEqual({
			email,
			password,
			returnSecureToken: true,
		});
	});
});
