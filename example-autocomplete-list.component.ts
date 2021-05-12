import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ExampleAutocompleteContentDirective } from './example-autocomplete-content.directive';
import { ExampleAutocompleteOptionComponent } from './example-autocomplete-option.component';
import { switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  selector: 'example-autocomplete-list',
  templateUrl: './example-autocomplete-list.component.html',
  exportAs: 'exAutocompleteList',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleAutocompleteListComponent {
  @ViewChild('root') rootTemplate: TemplateRef<any>;
  @ContentChild(ExampleAutocompleteContentDirective) content: ExampleAutocompleteContentDirective;
  @ContentChildren(ExampleAutocompleteOptionComponent) options: QueryList<ExampleAutocompleteOptionComponent>;

  optionsClick() {
    return this.options.changes.pipe(
      switchMap((options) => {
        const clicks$ = options.map((option) => option.click$);
        return merge(...clicks$);
      }),
    );
  }
}
