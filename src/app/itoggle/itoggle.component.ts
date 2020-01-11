import {
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  forwardRef, Inject, Optional, OnDestroy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ITOGGLE_OPTIONS } from './itoggle.token';
import { IToggleConfig } from './itoggle.config';
import { Observable, Subscription } from 'rxjs';

const UI_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  /* tslint:disable-next-line: no-use-before-declare */
  useExisting: forwardRef(() => IToggleComponent),
  multi: true,
};

@Component({
  selector: 'itoggle',
  templateUrl:'./itoggle.component.html',
  providers: [UI_SWITCH_CONTROL_VALUE_ACCESSOR],
})
export class IToggleComponent implements ControlValueAccessor, OnDestroy {
  private _checked: boolean;
  private _disabled: boolean;
  private _reverse: boolean;
  private _loading: boolean;
  private _beforeChange: Subscription;

  @Input() size;
  @Input() color;
  @Input() switchOffColor;
  @Input() switchColor;
  @Input() defaultBgColor;
  @Input() defaultBoColor;
  @Input() checkedLabel;
  @Input() uncheckedLabel;
  @Input() checkedTextColor;
  @Input() uncheckedTextColor;
  @Input() iconClass;
  @Input() beforeChange: Observable<boolean>;

  @Input()
  set checked(v: boolean) {
    this._checked = v !== false;
  }

  get checked() {
    return this._checked;
  }

  @Input()
  set disabled(v: boolean) {
    this._disabled = v !== false;
  }

  get disabled() {
    return this._disabled;
  }

  @Input()
  set reverse(v: boolean) {
    this._reverse = v !== false;
  }

  get reverse() {
    return this._reverse;
  }

  @Input()
  set loading(v: boolean) {
    this._loading = v !== false;
  }

  get loading() {
    return this._loading;
  }
  /**
   * Emits changed value
   */
  @Output() change = new EventEmitter<boolean>();

  /**
   * Emits DOM event
   */
  @Output() changeEvent = new EventEmitter<MouseEvent>();

  /**
   * Emits changed value
   */
  @Output() valueChange = new EventEmitter<boolean>();

  constructor(
    @Inject(ITOGGLE_OPTIONS) @Optional() config: IToggleConfig = {},
    private cdr: ChangeDetectorRef
  ) {
    this.size = config && config.size || 'medium';
    this.color = config && config.color;
    this.switchOffColor = config && config.switchOffColor;
    this.switchColor = config && config.switchColor;
    this.defaultBgColor = config && config.defaultBgColor;
    this.defaultBoColor = config && config.defaultBoColor;
    this.checkedLabel = config && config.checkedLabel;
    this.uncheckedLabel = config && config.uncheckedLabel;
    this.checkedTextColor = config && config.checkedTextColor;
    this.uncheckedTextColor = config && config.uncheckedTextColor;
    this.iconClass = config && config.iconClass;
  }

  getColor(flag = '') {
    if (flag === 'borderColor') {
      return this.defaultBoColor;
    }
    if (flag === 'switchColor') {
      if (this.reverse) {
        return !this.checked ? this.switchColor : this.switchOffColor || this.switchColor;
      }
      return this.checked ? this.switchColor : this.switchOffColor || this.switchColor;
    }
    if (flag === 'checkedTextColor') {
      return this.reverse ? this.uncheckedTextColor : this.checkedTextColor;
    }
    if (flag === 'uncheckedTextColor') {
      return this.reverse ? this.checkedTextColor : this.uncheckedTextColor;
    }
    if (this.reverse) {
      return !this.checked ? this.color : this.defaultBgColor;
    }
    return this.checked ? this.color : this.defaultBgColor;
  }
  
  getIconClass():string{

      let classList=' ';
      if(this.iconClass){
        classList += this.iconClass;
      }

      if(!this.checked){
        classList += ' disabled';
      }
      return classList;
  }

  onClick(event: MouseEvent) {
    if (this.disabled) {
      return;
    }
    this.checked = !this.checked;

    // Component events
    this.change.emit(this.checked);
    this.valueChange.emit(this.checked);
    this.changeEvent.emit(event);

    // value accessor callbacks
    this.onChangeCallback(this.checked);
    this.onTouchedCallback(this.checked);
    this.cdr.markForCheck();
  }

  @HostListener('click', ['$event'])
  onToggle(event: MouseEvent) {
    if (this.beforeChange) {
      this._beforeChange = this.beforeChange.subscribe((confirm: boolean) => {
        if (confirm) { this.onClick(event); }
      });
    } else {
      this.onClick(event);
    }
  }

  writeValue(obj: any): void {
    if (obj !== this.checked) {
      this.checked = !!obj;
    }
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  private onTouchedCallback = (v: any) => {};
  private onChangeCallback = (v: any) => { };

  ngOnDestroy() {
    if (this._beforeChange) {
      this._beforeChange.unsubscribe();
    }
  }
}
