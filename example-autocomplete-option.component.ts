import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'example-autocomplete-option',
  templateUrl: './example-autocomplete-option.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleAutocompleteOptionComponent implements OnInit {
  @Input() value: any;
  click$: Observable<any>;

  constructor(private host: ElementRef) {}

  ngOnInit() {
    this.click$ = fromEvent(this.element, 'click').pipe(mapTo(this.value));
  }

  get element() {
    return this.host.nativeElement;
  }
}
