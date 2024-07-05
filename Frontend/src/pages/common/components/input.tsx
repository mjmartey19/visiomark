import { PasswordInput, TextInput } from '@mantine/core';
import { useUserFormContext } from '../form-context';
import { GenericInputProps } from './types';
import { sx } from './layoutStyles';

const GenericInput = ({
  placeholder,
  label,
  val_name,
  type,
  accept,
}: GenericInputProps) => {
  const form = useUserFormContext();

  return (
    <div>
        <TextInput
          {...form.getInputProps(val_name)}
          placeholder={placeholder}
          label={label}
          type={type}
          sx={sx}
        />
      
    </div>
  );
};

export default GenericInput;
