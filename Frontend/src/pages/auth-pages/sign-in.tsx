import GenericInput from '../common/components/input';
import General from './general';
import { AiOutlineMail } from 'react-icons/ai';
import { FormTitle, InputWrapper } from './styles';
import GenericBtn from '../common/components/button';
import { z } from 'zod';
import { zodResolver } from '@mantine/form';
import { UserFormProvider, useUserForm } from '../common/form-context';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

type SignInForm = z.infer<typeof schema>;

// const form = useform;

const SignIn = () => {
  const form = useUserForm({
    validate: zodResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  });
  return (
    <General>
      <FormTitle>
        <p>Sign In</p>
      </FormTitle>

      <UserFormProvider form={form}>
        <InputWrapper onSubmit={form.onSubmit((values) => console.log(values))}>
          <GenericInput
            val_name="email"
            placeholder="someone@gmail.com "
            textInput
            label="Email"
            icon={<AiOutlineMail />}
          />
          <GenericInput
            placeholder="Password"
            val_name="password"
            label="Password"
          />
          <GenericBtn type="submit" title="Sign In" />
        </InputWrapper>
      </UserFormProvider>
    </General>
  );
};

export default SignIn;
