import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  Provider,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

export const AUTOCOMPLETE_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExampleisting: forwardRef(() => ExampleAutocompleteComponent),
  multi: true,
};

@Component({
  selector: 'example-autocomplete',
  templateUrl: './example-autocomplete.component.html',
  providers: [AUTOCOMPLETE_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleAutocompleteComponent<T> implements OnInit, ControlValueAccessor {
  @Input() placeholder: string;
  @Input() searchField: keyof T;
  @Input() labelField: keyof T;
  @Input() options: T[];

  @Output() selected: EventEmitter<T> = new EventEmitter<any>();
  @Output() manuallySelected: EventEmitter<T> = new EventEmitter<any>();
  @Output() cleared = new EventEmitter();

  public control = new FormControl();
  public filteredOptions: T[] = [];

  public ngOnInit() {
    this.filteredOptions = this.options ?? [];
  }

  public onSelected(option: T) {
    this.selected.emit(option);
    this.onChange(option);
    this.onTouch();
  }

  public onManuallySelected(option: T) {
    this.manuallySelected.emit(option);
  }

  public filter(searchTerm: string) {
    this.filteredOptions = this.transform(this.options, searchTerm, this.searchField);
    this.onTouch();
  }

  private transform(items: T[], searchTerm: string, propertyKey?: keyof T): any {
    if (!items || !searchTerm) {
      return items;
    }

    const searchTermLowerCased = searchTerm.toLowerCase();

    return items.filter((item) =>
      (propertyKey ? item[propertyKey] : item).toString().toLowerCase().includes(searchTermLowerCased),
    );
  }

  public onClear() {
    this.control.setValue('');
    this.filter('');
    this.cleared.emit();
    this.onTouch();
  }

  public writeValue(option: T): void {
    if (!option) {
      this.control.setValue('');
    } else {
      this.control.setValue(option[this.labelField]);
    }
    this.onSelected(option);
  }

  private onChange = (option: T): void => {};

  public registerOnChange(fn: (option: T) => void): void {
    this.onChange = fn;
  }

  private onTouch = (): void => {};

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public setDisabledState?(): void {}
}
