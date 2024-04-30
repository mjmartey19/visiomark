// NameInput.tsx
import { Select, TextInput } from '@mantine/core';
import { useUserFormContext } from '../form-context';
import { GenericInputProps } from './types';
import { sx } from './layoutStyles';

export function SelectInput({
  label,
  placeholder,
  val_name,
  data,
}: GenericInputProps) {
  const form = useUserFormContext();
  return (
    <Select
      {...form.getInputProps(val_name)}
      label={label}
      placeholder={placeholder}
      data={data ? data : []}
      sx={sx}
    />
  );
}
