import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketIoService {
	socket: any;
	private readonly serverUrl = 'http://localhost:3000';

	constructor() {
		this.socket = io(this.serverUrl);
	}

	listenToServer(eventName: string): Observable<any> {
		return new Observable((subscriber) => {
			this.socket.on(eventName, (data) => {
				// The server will emit the data to the client
				subscriber.next(data); // The client will receive the data
			});
		});
	}

	emitToServer(eventName: string, data: any) {
		// The client will emit the data to the server
		this.socket.emit(eventName, data); // The server will receive the data
	}

	emitToServerWithTwoParams(
		eventName: string,
		firstParam: any,
		secondParam: any,
	) {
		// The client will emit the data to the server
		this.socket.emit(eventName, firstParam, secondParam); // The server will receive the data
	}
}
