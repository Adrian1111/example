import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { ExampleAutocompleteListComponent } from './example-autocomplete-list.component';
import { ExampleAutocompleteOptionComponent } from './example-autocomplete-option.component';
import { ExampleAutocompleteDirective } from './example-autocomplete.directive';
import { ExampleAutocompleteContentDirective } from './example-autocomplete-content.directive';
import { ExampleAutocompleteComponent } from './example-autocomplete.component';

const publicApi = [
  ExampleAutocompleteComponent,
  ExampleAutocompleteListComponent,
  ExampleAutocompleteOptionComponent,
  ExampleAutocompleteDirective,
  ExampleAutocompleteContentDirective,
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, OverlayModule],
  declarations: [...publicApi],
  exports: [publicApi],
})
export class ExampleAutocompleteModule {}
