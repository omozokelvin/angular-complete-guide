import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const { email, password } = form.value;

    this.isLoading = true;

    const authObs$: Observable<AuthResponseData> = this.isLoginMode ?
      this.authService.login(email, password) :
      this.authService.signup(email, password);

    authObs$.subscribe(
      response => {
        console.log(response);
        this.isLoading = false;

        this.router.navigate(['/recipes']);
      },
      (errorMessage: string) => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

}
