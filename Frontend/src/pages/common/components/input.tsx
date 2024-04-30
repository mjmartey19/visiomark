import { PasswordInput, TextInput } from '@mantine/core';
import { useUserFormContext } from '../form-context';
import { GenericInputProps } from './types';
import { sx } from './layoutStyles';

const GenericInput = ({
  placeholder,
  icon,
  label,
  textInput,
  val_name,
  type,
  description,
}: GenericInputProps) => {
  const form = useUserFormContext();

  return (
    <div>
      {textInput ? (
        <TextInput
          {...form.getInputProps(val_name)}
          placeholder={placeholder}
          icon={icon}
          label={label}
          withAsterisk
          type={type}
          sx={sx}
        />
      ) : (
        <PasswordInput
          {...form.getInputProps(val_name)}
          placeholder={placeholder}
          label={label}
          sx={sx}
          description={description}
          withAsterisk
        />
      )}
    </div>
  );
};

export default GenericInput;
