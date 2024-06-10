import Layout from '../common/components/Layout';
import { Text } from '@mantine/core';
import { THEME } from '../../appTheme';
import GenericInput from '../common/components/input';
import { InputWrapper } from '../auth-pages/styles';
import GenericBtn from '../common/components/button';
import { z } from 'zod';
import { zodResolver } from '@mantine/form';
import { UserFormProvider, useUserForm } from '../common/form-context';
import { useContext, useEffect } from 'react';
import { appContext } from '../../utils/Context';

const schema = z.object({
  correct: z.preprocess((val) => Number(val), z.number().min(1)),
  incorrect: z.preprocess((val) => Number(val), z.number()),
});

type SettingForm = z.infer<typeof schema>;

const Settings = () => {
  const { correct, incorrect, setCorrect, setIncorrect } = useContext(appContext);

  const form = useUserForm({
    validate: zodResolver(schema),
    initialValues: {
      correct: correct ?? 1,  
      incorrect: incorrect ?? 0, 
    },
  });

  // Update form values when context values change
  useEffect(() => {
    form.setValues({ correct, incorrect });
  }, [correct, incorrect]);

  const handleSubmit = (values: SettingForm) => {
    let correct = Number(values.correct)
    let incorrect = Number(values.incorrect)
    setCorrect(correct);
    setIncorrect(incorrect);
    console.log(correct, incorrect);
  };

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
        <InputWrapper onSubmit={form.onSubmit((values) => handleSubmit(values as SettingForm))}>
          <GenericInput
            val_name="correct"
            placeholder="0"
            label="Mark(s) per correct answer"
          />
          <GenericInput
            val_name="incorrect"
            placeholder="0"
            label="Mark(s) per incorrect answer"
          />
          <GenericBtn
            type="submit"
            title="Update"
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

export default Settings;
