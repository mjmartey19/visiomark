import { SelectItem } from '@mantine/core';

export type GenericInputProps = {
  placeholder: string;
  icon?: React.ReactNode;
  label: string;
  textInput?: boolean;
  description?: string;
  val_name: string;
  type?: React.HTMLInputTypeAttribute;
  data?: readonly (string | SelectItem)[];
};
