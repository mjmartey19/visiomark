import ModalComp from '../common/Modal/Modal';
import { LogoWrapper } from '../common/components/layoutStyles';
import { UserFormProvider, useUserForm } from '../common/form-context';
import { UseFormReturnType, zodResolver } from '@mantine/form';
import { KeyheadStyles, LoaderWrapper, ModalInputs, Title } from './styles';
import GenericInput from '../common/components/input';
import GenericBtn from '../common/components/button';
import { THEME } from '../../appTheme';
import { SelectInput } from '../common/components/SelectInput';
import { useEffect, useState } from 'react';
import { Constants } from '../../utils/constants';
import {
  Group,
  Loader,
  Stepper,
  Badge,
  Box,
  ScrollArea,
  StepperProps,
  rem,
  Text,
} from '@mantine/core';
import MasterKeyPage from '../master-key';
import { schema } from './schema';
import useDashboard from './hook/useDashboard';

const Modalforms = ({ open, close }: { open: boolean; close: () => void }) => {
  const [active, setActive] = useState(0);

  const {
    all,
    setAll,
    handleFolderSelect,
    mutate,
    selectedFolder,
    validateData,
  } = useDashboard();

  function DisplayDivMultipleTimes() {
    const divs = [];

    // @ts-ignore
    for (let i = 1; i <= parseInt(form.values['number_of_questions']); i++) {
      divs.push(
        <MasterKeyPage
          key={i}
          all={all}
          setAll={setAll}
          index={i}
          question_number={i}
        />
      );
    }

    return <>{divs}</>;
  }

  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const form: UseFormReturnType<unknown, (values: unknown) => typeof schema> =
    useUserForm({
      validate: zodResolver(schema),
      initialValues: {
        course_code: '',
        department_code: '',
        year: '',
        number_of_questions: '',
        academic_year: '',
        lecturer_name: '',
      },
    });

  return (
    <>
      <ModalComp opened={open} close={close}>
        {mutate.isLoading ? (
          <LoaderWrapper>
            <Loader />
            <p>Good things take time!!</p>
          </LoaderWrapper>
        ) : (
          <UserFormProvider form={form}>
            {/* @ts-ignore */}
            <form onSubmit={form.onSubmit((value) => mutate.mutate(value))}>
              <Stepper
                active={active}
                onStepClick={setActive}
                color={`${THEME.colors.background.jet}`}
                size="sm"
              >
                <Stepper.Step>
                  <ModalInputs>
                    <GenericInput
                      {...form.getInputProps('lecturer_name')}
                      placeholder="Kojo Nkansah"
                      val_name="lecturer_name"
                      label="Name of Lecturer"
                    />

                    <GenericInput
                      {...form.getInputProps('course_code')}
                      placeholder="COE 343"
                      val_name="course_code"
                      label="Course code"
                    />

                    <GenericInput
                      val_name="department_code"
                      placeholder="050"
                      label="Department code"
                      type="number"
                    />
                  </ModalInputs>
                </Stepper.Step>
                <Stepper.Step>
                  <ModalInputs>
                    <SelectInput
                      label="Year"
                      val_name="year"
                      placeholder="Select year"
                      data={Constants.ACADEMIC_LEVELS}
                    />
                    <SelectInput
                      label="Academic year"
                      val_name="academic_year"
                      placeholder="Select academic year"
                      data={Constants.ACADEMIC_YEAR}
                    />
                    <GenericInput
                      placeholder="40"
                      val_name="number_of_questions"
                      label="Total count of questions"
                    />
                    <GenericBtn
                      title="Select Folder"
                      onClick={handleFolderSelect}
                      type="button"
                      sx={{
                        height: '2.5rem',
                        width: '100%',
                        fontSize: '1rem',
                        background: '#fff',
                        borderRadius: '10px',
                        color: `${THEME.colors.background.black}`,

                        '&:hover': {
                          background: THEME.colors.button.midnight_green,
                        },
                      }}
                    />
                    {selectedFolder && (
                      <Text
                        c={THEME.colors.text.primary}
                        sx={{ fontFamily: 'poppins, sans-serif' }}
                        ta="center"
                        fz="0.8rem"
                        fw={500}
                      >
                        {selectedFolder}
                      </Text>
                    )}
                  </ModalInputs>
                </Stepper.Step>
                <Stepper.Completed>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '90%'
                    }}
                  >
                    <KeyheadStyles>Select the correct answers</KeyheadStyles>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        c={THEME.colors.text.primary}
                        sx={{
                          fontFamily: 'poppins, sans-serif',
                          textDecoration: 'underline',
                        }}
                        ta="center"
                        fz="0.8rem"
                        fw={500}
                      >
                        Mark(S)
                      </Text>
                      <Text
                        c={THEME.colors.text.primary}
                        sx={{
                          fontFamily: 'poppins, sans-serif',
                          textDecoration: 'underline',
                        }}
                        
                        ta="center"
                        fz="0.8rem"
                        fw={500}
                      >
                        Bonus
                      </Text>
                    </div>
                  </div>

                  <DisplayDivMultipleTimes />
                </Stepper.Completed>
              </Stepper>

              <br />

              <Group
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 0 3rem 0',
                }}
                position="center"
                mt="xl"
              >
                <GenericBtn
                  title="Back"
                  type="button"
                  onClick={prevStep}
                  sx={{
                    fontSize: '0.8rem',
                    borderRadius: '20px',
                    padding: '0 3rem',
                    color: `#fff`,
                    background: `${THEME.colors.background.jet}`,
                    '&:hover': {
                      background: THEME.colors.background.primary,
                    },
                  }}
                />
                {active != 2 ? (
                  <GenericBtn
                    title="Next"
                    type="button"
                    onClick={nextStep}
                    sx={{
                      fontSize: '0.8rem',
                      borderRadius: '20px',
                      padding: '0 3rem',
                      color: '#000000',
                      background: '#fff',

                      '&:hover': {
                        background: THEME.colors.button.midnight_green,
                      },
                    }}
                  />
                ) : null}

                {active == 2 ? (
                  <GenericBtn
                    title="Done"
                    type="submit"
                    onClick={() => validateData(form.values)}
                    sx={{
                      fontSize: '0.8rem',
                      borderRadius: '20px',
                      padding: '0 3rem',
                      color: '#000000',
                      background: '#fff',

                      '&:hover': {
                        background: THEME.colors.button.midnight_green,
                      },
                    }}
                  />
                ) : null}
              </Group>
            </form>
          </UserFormProvider>
        )}
      </ModalComp>
    </>
  );
};

export default Modalforms;
