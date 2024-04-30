import ModalComp from '../common/Modal/Modal';
import { LogoWrapper } from '../common/components/layoutStyles';
import { UserFormProvider, useUserForm } from '../common/form-context';
import { UseFormReturnType, zodResolver } from '@mantine/form';
import { KeyheadStyles, LoaderWrapper, ModalInputs, Title } from './styles';
import GenericInput from '../common/components/input';
import GenericBtn from '../common/components/button';
import { THEME } from '../../appTheme';
import { SelectInput } from '../common/components/SelectInput';
import { useState } from 'react';
import { Constants } from '../../utils/constants';
import { Group, Loader, Stepper, Badge, Box, ScrollArea } from '@mantine/core';
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
        <LogoWrapper>
          <img src="/src/assets/logo.svg" width={40} alt="logo" />
          <Title>visioMark</Title>
        </LogoWrapper>
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
                styles={{
                  stepLabel: {
                    color: `${THEME.colors.button.primary}`,
                  },
                }}
              >
                <Stepper.Step label="Step 1">
                  <ModalInputs>
                    <GenericInput
                      {...form.getInputProps('lecturer_name')}
                      placeholder="Kojo Nkansah"
                      val_name="lecturer_name"
                      label="Name of Lecturer"
                      textInput
                      icon
                    />

                    <GenericInput
                      {...form.getInputProps('course_code')}
                      placeholder="COE 343"
                      val_name="course_code"
                      label="Course code"
                      textInput
                      icon
                    />

                    <GenericInput
                      val_name="department_code"
                      placeholder="050"
                      label="Department code"
                      textInput
                      type="number"
                      icon
                    />
                  </ModalInputs>
                </Stepper.Step>
                <Stepper.Step label="step 2">
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
                      textInput
                      icon
                    />
                    <GenericBtn
                      title="Select Folder"
                      onClick={handleFolderSelect}
                      type="button"
                      sx={{
                        height: '2rem',
                        width: '100%',
                        fontSize: '1rem',
                        background: `${THEME.colors.button.primary}`,
                      }}
                    />
                    {selectedFolder && (
                      <Badge
                        pl={0}
                        size="lg"
                        color={`${THEME.colors.text.primary}`}
                        radius="xl"
                      >
                        <p>{selectedFolder}</p>
                      </Badge>
                    )}
                  </ModalInputs>
                </Stepper.Step>
                <Stepper.Completed>
                  <KeyheadStyles>Select the correct answers</KeyheadStyles>
                  <DisplayDivMultipleTimes />
                </Stepper.Completed>
              </Stepper>

              <br />

              <Group position="center" mt="xl">
                <GenericBtn
                  title="Back"
                  type="button"
                  onClick={prevStep}
                  sx={{
                    height: '2rem',
                    width: '5rem',
                    fontSize: '1rem',
                    background: `${THEME.colors.button.primary}`,
                  }}
                />
                {active != 2 ? (
                  <GenericBtn
                    title="Next"
                    type="button"
                    onClick={nextStep}
                    sx={{
                      height: '2rem',
                      width: '5rem',
                      fontSize: '1rem',
                      background: `${THEME.colors.button.primary}`,
                    }}
                  />
                ) : null}

                {active == 2 ? (
                  <GenericBtn
                    title="Done"
                    type="submit"
                    onClick={() => validateData(form.values)}
                    sx={{
                      height: '2rem',
                      width: '5rem',
                      fontSize: '1rem',
                      background: `${THEME.colors.button.primary}`,
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
