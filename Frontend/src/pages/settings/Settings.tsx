import Layout from '../common/components/Layout';
import { Text } from '@mantine/core';
import { THEME } from '../../appTheme';
import GenericInput from '../common/components/input';
import { InputWrapper } from '../auth-pages/styles';
import GenericBtn from '../common/components/button';
import { z } from 'zod';
import { zodResolver } from '@mantine/form';
import { UserFormProvider, useUserForm } from '../common/form-context';

const schema = z.object({
  correct: z.number().min(1),
  incorrect: z.number().min(0),
});

type SettingForm = z.infer<typeof schema>;


const Settings = () => {
  const form = useUserForm({
    validate: zodResolver(schema),
    initialValues: {
      correct: 1,
      incorrect: 0,
    },
  });
  return (
    <Layout>
       <Text
          c="#fff"
          sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
          ta="left"
          fz="2rem"
          fw={700}
        >
          Advance Settings
      </Text>
   
      <UserFormProvider form={form}>
        <InputWrapper onSubmit={form.onSubmit((values:number) => console.log(values))}>
          <GenericInput
            val_name="correct"
            placeholder= "0"
            label="Mark(s) per correct answer"
          />
          <GenericInput
            val_name="incorrect"
            placeholder="0"
            label="Mark(s) per incorrect answer"
          />
          <GenericBtn type="submit" title="Update" 
           sx={{
            borderRadius: '20px',
            color: THEME.colors.button.black,
            width: '10rem',
            background: '#fff',
            '&:hover': {
              background: THEME.colors.button.midnight_green,
            },
          }}
          />
        </InputWrapper>
      </UserFormProvider>
    </Layout>
  );
};



const Setting = () => {
  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: 'calc(100% - 64px)',
        }}
      >
        <Text
          c="#fff"
          sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
          ta="left"
          fz="2rem"
          fw={700}
        >
          Advance Settings
        </Text>

       </div>
    </Layout>
  );
};

export default Settings;
