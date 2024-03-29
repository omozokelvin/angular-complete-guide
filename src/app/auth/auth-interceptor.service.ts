import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // exhaustMap returns a new observable after the first is complete.
    // switchMap switches to a new observable and returns it
    // take (1) will subscribe just once on demand and unsubscribe

    return this.store.select('auth')
      .pipe(
        take(1),
        map(authState => authState.user),
        exhaustMap(user => {
          if (!user) {
            return next.handle(req);
          }

          const modifiedRequest = req.clone({
            params: new HttpParams().set('auth', user.token)
          });

          return next.handle(modifiedRequest);
        })
      );
  }
}
