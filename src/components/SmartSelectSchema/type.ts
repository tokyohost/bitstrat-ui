export type FormComponent = 'input' | 'textarea' | 'select' | 'number' | 'switch';

export interface FormSchemaItem {
  field: string;
  label: string;
  component: FormComponent;
  required?: boolean;
  props?: Record<string, any>;
  options?: OptionsItem[];
  rules?: any[];
  defaultValue?: any;
  desc?: string;
}
export interface OptionsItem {
  label: string;
  value: string | number;
  children?: FormSchemaItem;
  shortcut?: string;
  desc?: string;
}

export interface SelectItem {
  type?: string;
  value?: string;
  name?: string;
  desc?: string;
}

export interface extConfigItem {
  type: string;
  value: string;
  desc: string;
}

export interface ExtConfig {
  defaultOptions: extConfigItem[];
  modify: extConfigItem[];
}
