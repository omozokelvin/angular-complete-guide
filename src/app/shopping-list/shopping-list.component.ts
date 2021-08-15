import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients$: Observable<{ ingredients: Ingredient[] }>;
  // private ingredientChangeSub: Subscription;

  constructor(
    private loggingService: LoggingService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.ingredients$ = this.store.select('shoppingList');

    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit');
  }

  onEditItem(index: number): void {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

}
