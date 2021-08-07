import { map, take, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean |
    UrlTree |
    Observable<boolean | UrlTree> |
    Promise<boolean | UrlTree> {

    return this.authService.user
      .pipe(
        take(1),
        map(user => {
          const isAuth = !!user;

          return isAuth ?
            true :
            this.router.createUrlTree(['/auth']);
        }),
        // tap(isAuth => {
        //   if (!isAuth) {
        //     this.router.navigate(['/auth']);
        //   }
        // }) old approach, problem could occur with some finicky redirect loop
      );
  }
}
