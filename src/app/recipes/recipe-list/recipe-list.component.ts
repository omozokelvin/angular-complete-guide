import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe('A test recipe',
      'This is simply a test',
      'https://www.indianhealthyrecipes.com/wp-content/uploads/2019/11/samosa-recipe.jpg'),
    new Recipe('Another test recipe',
      'This is simply a test',
      'https://www.indianhealthyrecipes.com/wp-content/uploads/2019/11/samosa-recipe.jpg'),
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }

}
