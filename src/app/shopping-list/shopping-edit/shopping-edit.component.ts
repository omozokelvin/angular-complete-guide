import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing
      .subscribe((
        (index: number) => {
          this.editedItemIndex = index;
          this.editMode = true;

          this.editedItem = this.shoppingListService.getIngredient(index);

          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          });
        }
      ));
  }

  onSubmitItem(form: NgForm): void {
    const { name, amount } = form.value;
    const newIngredient = new Ingredient(name, amount);

    if(this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }

    this.onClear();
  }

  onClear(): void {
    this.editMode = false;
    this.editedItemIndex = null;
    this.slForm.reset();
  }

  onDelete(): void {
    this.shoppingListService.onDeleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
