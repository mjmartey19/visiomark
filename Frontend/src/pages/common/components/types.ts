import { SelectItem } from '@mantine/core';

export type GenericInputProps = {
  placeholder: string;
  label: string;
  textInput?: boolean;
  description?: string;
  val_name: string;
  type?: React.HTMLInputTypeAttribute;
  data?: readonly (number | string | SelectItem)[];
};
