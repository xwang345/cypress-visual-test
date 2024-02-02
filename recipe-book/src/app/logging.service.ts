import { Inject } from '@angular/core'

@Inject({ providedIn: 'root' })
export class LoggingService {
	lastlog: string

	printLog(message: string) {
		console.log(message)
		console.log(this.lastlog)
		this.lastlog = message
	}
}
