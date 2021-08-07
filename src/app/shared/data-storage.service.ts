import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private readonly recipeUrl = 'https://kelvin-ng-course-recipe-book-default-rtdb.firebaseio.com/receipes.json';

  constructor(
    private httpClient: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) { }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();

    this.httpClient.put(this.recipeUrl, recipes)
      .subscribe(
        response => {
          console.log(response);
        }
      );
  }

  fetchRecipes(): Observable<Recipe[]> {
    // exhaustMap returns a new observable after the first is complete.
    // take (1) will subscribe just once on demand and unsubscribe

    return this.authService.user
      .pipe(
        take(1),
        exhaustMap(user => {
          return this.httpClient.get<Recipe[]>(this.recipeUrl,
            {
              params: new HttpParams().set('auth', user.token),
            }
          );
        }),
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredient: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          console.log(recipes);
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
