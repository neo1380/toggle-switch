This switch is derived from ngx-toggle-switch which is derived from webcat12345/ngx-ui-switch, which was itself derived from yuyang041060120/angular2-ui-switch.

New configuration to show icons in toggle knob is included.

export interface IToggleConfig {
  size?: string;
  color?: string;
  switchOffColor?: string;
  switchColor?: string;
  defaultBgColor?: string;
  defaultBoColor?: string;
  checkedLabel?: string;
  uncheckedLabel?: string;
  checkedTextColor?: string;
  uncheckedTextColor?: string;
  iconClass?:string;
}
