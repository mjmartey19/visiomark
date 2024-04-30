// import { z } from 'zod';
// import { NameInput } from '../common/components/NameInput';
// import { UserFormProvider, useUserForm } from '../common/form-context';
// import General from './general';
// import { NumberInput } from '@mantine/core';
// import { zodResolver } from '@mantine/form';
// import GenericInput from '../common/components/input';

// const schema = z.object({
//   age: z.number().min(2),
//   name: z.string().min(3),
//   username: z.string().min(3),
// });

// const SignUp = () => {
//   const form = useUserForm({
//     validate: zodResolver(schema),
//     initialValues: {
//       age: 0,
//       name: '',
//       username: '',
//     },
//   });
//   return (
//     <General>
//       <UserFormProvider form={form}>
//         <form
//           onSubmit={form.onSubmit((values) => {
//             console.log(values);
//           })}
//         >
//           <GenericInput
//             label="username"
//             placeholder="username"
//             textInput
//             {...form.getInputProps('username')}
//           />
//           <NumberInput label="Age" {...form.getInputProps('age')} />
//           <NameInput />
//           <button>Submit</button>
//         </form>
//       </UserFormProvider>
//     </General>
//   );
// };

// export default SignUp;

import GenericInput from '../common/components/input';
import General from './general';
import { AiOutlineUser, AiOutlineMail } from 'react-icons/ai';
import { FormTitle, InputWrapper } from './styles';
import GenericBtn from '../common/components/button';
import { z } from 'zod';
import { UserFormProvider, useUserForm } from '../common/form-context';
import { zodResolver } from '@mantine/form';

const schema = z
  .object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    confirm_password: z.string().min(8).max(100),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type SignUpForm = z.infer<typeof schema>;

const SignUp = () => {
  const form = useUserForm({
    validate: zodResolver(schema),
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });
  return (
    <General>
      <FormTitle>
        <p>Sign Up</p>
        <p>Fill in the details and we can get you started.</p>
      </FormTitle>

      <UserFormProvider form={form}>
        <InputWrapper onSubmit={form.onSubmit((value) => console.log(value))}>
          <GenericInput
            {...form.getInputProps('username')}
            val_name="username"
            textInput
            placeholder="Username "
            icon={<AiOutlineUser />}
            label={'Username'}
          />
          <GenericInput
            {...form.getInputProps('email')}
            val_name="email"
            textInput
            placeholder="someone@gmail.com "
            label="Email"
            icon={<AiOutlineMail />}
          />
          <GenericInput
            {...form.getInputProps('password')}
            val_name="password"
            placeholder="Password"
            label="Password"
            description="Password must include at least one letter, number and special character"
          />
          <GenericInput
            val_name="confirm_password"
            {...form.getInputProps('confirm_password')}
            placeholder="confirm your password"
            label="Confirm Password"
            description="Password must include at least one letter, number and special character"
          />
          <GenericBtn title="Sign Up" type="submit" />
        </InputWrapper>
      </UserFormProvider>
    </General>
  );
};

export default SignUp;
