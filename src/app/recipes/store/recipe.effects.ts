import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';

@Injectable()
export class RecipeEffects {

  fetchRecipes = createEffect(
    () => this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.httpClient.get<Recipe[]>('https://kelvin-ng-course-recipe-book-default-rtdb.firebaseio.com/receipes.json');
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredient: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      map(recipes => {
        return new RecipesActions.SetRecipes(recipes);
      })
    )
  );

  // withLatestFrom allows us to merge a value from another observable to this
  storeRecipes = createEffect(
    () => this.actions$.pipe(
      ofType(RecipesActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipesState]) => {
        return this.httpClient.put('https://kelvin-ng-course-recipe-book-default-rtdb.firebaseio.com/receipes.json', recipesState.recipes);
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<fromApp.AppState>
  ) { }
}
