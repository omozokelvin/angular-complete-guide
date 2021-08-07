import { User } from './user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);

  constructor(private httpClient: HttpClient) { }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.httpClient.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBOZ8QmkBBWXjxPuK0OQeX2klich8VQqIc',
      {
        email,
        password,
        returnSecureToken: true
      }).pipe(
        catchError(this.handleError),
        tap((responseData) => this.handleAuthentication(responseData))
      );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.httpClient.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBOZ8QmkBBWXjxPuK0OQeX2klich8VQqIc',
      {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap((responseData) => this.handleAuthentication(responseData))
      );
  }

  private handleAuthentication(responseData: AuthResponseData): void {
    const { email, localId, idToken, expiresIn } = responseData;

    const expirationDate = new Date(new Date().getTime() + (+expiresIn) * 1000);

    const user = new User(
      email,
      localId,
      idToken,
      expirationDate
    );

    this.user.next(user);
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (!errorResponse.error.error || !errorResponse.error.error.message) {
      return throwError(errorMessage);
    }

    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already.';
        break;

      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;

      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;

      default:
        break;
    }

    return throwError(errorMessage);
  }
}
