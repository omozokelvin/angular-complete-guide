import * as AuthActions from './auth/store/auth.actions';
import * as fromApp from './store/app.reducer';
import { Component, OnInit } from '@angular/core';
import { LoggingService } from './logging.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title: 'My first app';

  constructor(
    private store: Store<fromApp.AppState>,
    private loggingService: LoggingService
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new AuthActions.AutoLogin());

    this.loggingService.printLog('Hello from App Component');
  }
}
