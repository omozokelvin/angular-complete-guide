import { Ingredient } from './../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Recipe } from './recipe.model';
import * as shoppingListActions from '../shopping-list/store/shopping-list.actions';

// TO INJECT A SERVICE TO ANOTHER SERVICE, ADD @INJECTABLE TO THE SERVICE THAT NEEDS THE OTHER SERVICES

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();


  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Tasty Schnitzel',
  //     'A super-tasty Schnitzel - just awesome!',
  //     'https://toriavey.com/images/2011/02/TOA20_06-1.jpg',
  //     [
  //       new Ingredient('Meat', 1),
  //       new Ingredient('French Fries', 20)
  //     ]
  //   ),
  //   new Recipe(
  //     'Big Fat Burger',
  //     'What else you need to say?',
  //     'https://b.zmtcdn.com/data/pictures/chains/5/18962805/009f38b4e2be1043d48a1246f681efb7.png',
  //     [
  //       new Ingredient('Buns', 2),
  //       new Ingredient('Meat', 1)
  //     ]
  //   )
  // ];

  private recipes: Recipe[] = [];

  constructor(
    private store: Store<{ Ingredients: Ingredient[] }>
  ) { }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  addIngredientToShoppingList(ingredients: Ingredient[]): void {
    this.store.dispatch(new shoppingListActions.AddIngredients(ingredients));
  }

  getRecipe(index: number): Recipe {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe): void {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
