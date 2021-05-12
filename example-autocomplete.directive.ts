import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { ConnectionPositionPair, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ExampleAutocompleteListComponent } from './example-autocomplete-list.component';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter, takeUntil } from 'rxjs/operators';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[exAutocomplete]',
})
export class ExampleAutocompleteDirective implements AfterViewInit, OnDestroy {
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();
  @Input() exAutocomplete: ExampleAutocompleteListComponent;
  @Input() labelField: string;
  @Input() set maxHeight(value: number) {
    if (value !== null) {
      this._maxHeight = value;
    }
  }
  get maxHeight(): number {
    return this._maxHeight;
  }
  private _maxHeight = 300;

  private overlayRef: OverlayRef;
  private notifier = new Subject();

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private ngControl: NgControl,
    private vcr: ViewContainerRef,
    private overlay: Overlay,
  ) {}

  ngAfterViewInit() {
    fromEvent(this.origin, 'focus')
      .pipe(takeUntil(this.notifier))
      .subscribe(() => {
        this.openDropdown();

        this.exAutocomplete
          .optionsClick()
          .pipe(takeUntil(this.overlayRef.detachments()))
          .subscribe((item: any) => {
            this.control.setValue(item[this.labelField]);
            this.selected.emit(item);
            this.close();
          });
      });
  }

  ngOnDestroy() {
    this.notifier.next();
    this.notifier.complete();
  }

  openDropdown() {
    this.overlayRef = this.overlay.create({
      width: this.origin.parentElement.offsetWidth,
      maxHeight: this.maxHeight,
      backdropClass: '',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.getOverlayPosition(),
    });

    const template = new TemplatePortal(this.exAutocomplete.rootTemplate, this.vcr);
    this.overlayRef.attach(template);

    overlayClickOutside(this.overlayRef, this.origin).subscribe(() => this.close());
  }

  @HostListener('window:blur')
  private close() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }

  private getOverlayPosition() {
    const positions = [
      new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
      new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(this.origin)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(false);
  }

  get origin() {
    return this.host.nativeElement;
  }

  get control() {
    return this.ngControl.control;
  }
}

export function overlayClickOutside(overlayRef: OverlayRef, origin: HTMLElement) {
  return fromEvent<MouseEvent>(document, 'click').pipe(
    filter((event) => {
      const clickTarget = event.target as HTMLElement;
      const notOrigin = clickTarget !== origin;
      const notOverlay = !!overlayRef && overlayRef.overlayElement.contains(clickTarget) === false;
      return notOrigin && notOverlay;
    }),
    takeUntil(overlayRef.detachments()),
  );
}
