import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class FakeService {
	constructor(private http: HttpClient) {}

	getDataValue1(): Observable<any> {
		const url = 'https://jsonplaceholder.typicode.com/posts/1';
		return this.http.get(url);
	}
}
