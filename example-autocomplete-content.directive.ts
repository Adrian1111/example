import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[exAutocompleteContent]',
})
export class ExampleAutocompleteContentDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
