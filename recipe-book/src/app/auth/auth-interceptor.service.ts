import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { take, exhaustMap } from "rxjs/operators";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) { // intercept is a method that takes two arguments: req and next
    return this.authService.user.pipe(
      take(1), // take(1) takes the latest user value and then automatically unsubscribes
      exhaustMap(user => {  // exhaustMap waits for the first observable (user) to complete, then it uses the user value to return a new observable (next.handle(modifiedReq))
        if (!user) { // if user is null, then return next.handle(req) observable
          return next.handle(req);
        }

        const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)}); // clone the request and add the token as a query parameter
        return next.handle(modifiedReq); // return the next.handle(modifiedReq) observable  
      }));
  }
}