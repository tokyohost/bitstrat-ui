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

export interface SelectItem {
  code?: string;
  name?: string;
}
export interface OptionsItem {
  label: string;
  value: string | number;
  children?: FormSchemaItem;
  shortcut?: string;
  desc?: string;
}
