import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { map, tap, take } from 'rxjs/operators'
import { AuthService } from './auth.service'

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}
    
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
      return this.authService.user.pipe(
        take(1) // take(1) takes the latest user value and then automatically unsubscribes
        ,map(user => {
          const isAuth = !!user;
          if (isAuth) {
            return true; // if authenticated, then return true
          }
          return this.router.createUrlTree(['/auth']); // if not authenticated, then redirect to /auth
        }), 
      // tap(isAuth => {
      //   if (!isAuth) {
      //     this.router.navigate(['/auth']);
      //   }
      // })
      );  
    }
}