import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from './../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  @ViewChild(PlaceHolderDirective, { static: true }) alertHost: PlaceHolderDirective;

  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth')
      .subscribe(authState => {
        this.isLoading = authState.loading;
        this.error = authState.authError;

        if (this.error) {
          this.showErrorAlert(this.error);
        }
      });
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const { email, password } = form.value;

    this.isLoginMode ?
      this.store.dispatch(new AuthActions.LoginStart({ email, password })) :
      this.store.dispatch(new AuthActions.SignupStart({ email, password }));

    form.reset();
  }

  private showErrorAlert(message: string): void {
    const alertComponentFactory = this.componentFactoryResolver.
      resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;

    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef
      .createComponent(alertComponentFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close
      .subscribe(() => {
        this.closeSub.unsubscribe();
        hostViewContainerRef.clear();
      });
  }

  onHandleError(): void {
    this.store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }

    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
