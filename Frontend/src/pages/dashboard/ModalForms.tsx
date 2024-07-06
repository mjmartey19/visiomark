import ModalComp from '../common/Modal/Modal';
import { UserFormProvider, useUserForm } from '../common/form-context';
import { UseFormReturnType, zodResolver } from '@mantine/form';
import { KeyheadStyles, LoaderWrapper, ModalInputs, Title } from './styles';
import GenericInput from '../common/components/input';
import GenericBtn from '../common/components/button';
import { THEME } from '../../appTheme';
import { useContext, useEffect, useState } from 'react';
import { readBinaryFile } from '@tauri-apps/api/fs';
import { Group, Loader, Stepper, Text } from '@mantine/core';
import MasterKeyPage from '../master-key';
import { schema } from './schema';
import useDashboard from './hook/useDashboard';
import { dialog } from '@tauri-apps/api';
import * as XLSX from 'xlsx';
import { appContext } from '../../utils/Context';
import { IAllData } from './types';

interface MarkingSchemeData {
  choice: string;
  marks: number;
  bonus: number;
}

const Modalforms = ({ open, close }: { open: boolean; close: () => void }) => {
  const [active, setActive] = useState<number>(0);
  
  const [isNextDisabled, setIsNextDisabled] = useState<boolean>(true); // State to manage next button disable
  
  const {
    handleFolderSelect,
    mutate,
    all,
    setAll,
    selectedFolder,
    validateData,
  } = useDashboard();
  
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { incorrect } = useContext(appContext);
  const [markingSchemeLength, setMarkingSchemeLength] = useState<number>()

  async function handleMarkingSchemeFile() {
    const markingSchemeFile = await dialog.open({
      multiple: false,
      filters: [
        {
          name: 'File',
          extensions: ['xlsx'],
        },
      ],
      directory: false,
      title: 'Select Marking Scheme',
    });

    if (typeof markingSchemeFile === 'string') {
      setSelectedFile(markingSchemeFile);
      const filePath = markingSchemeFile;

      // Read the file using Tauri's filesystem API
      const arrayBuffer = await readBinaryFile(filePath);
      console.log(arrayBuffer);
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Assuming the data is in the first sheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      console.log(jsonData);	
      // Extract the required data format: choice, marks, bonus
      const formattedData: IAllData = {};
      jsonData.forEach((row, index) => {
        formattedData[row.__rowNum__] = {
          choice: row.Choice || '',
          correct: row.Marks,
          incorrect: incorrect,
          isBonus: row.Bonus 
        };
      });

      setAll(formattedData);
      console.log(formattedData);
    }
  }



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

  const handleSubmit = (values: any) => {
    setMarkingSchemeLength(Object.keys(all).length);
    console.log(markingSchemeLength);
    console.log(parseInt(values.number_of_questions))
    if (parseInt(values.number_of_questions) !== markingSchemeLength) {
      alert("The number of questions does not match the length of the uploaded file data.");
      return;
    }
    validateData(values);
  };

  const form: UseFormReturnType<any, (values: any) => typeof schema> =
    useUserForm({
      validate: zodResolver(schema),
      initialValues: {
        course_code: '',
        department_code: '',
        year: '',
        number_of_questions: '',
      },
    });

  useEffect(() => {
    const currentStepInputs = getCurrentStepInputs();
    setIsNextDisabled(!currentStepInputs.every((val) => val));
  }, [active, form.values, selectedFolder]);

  const getCurrentStepInputs = (): (string | undefined)[] => {
    switch (active) {
      case 0:
        return [form.values.course_code, form.values.department_code];
      case 1:
        return [form.values.number_of_questions, selectedFolder];
      default:
        return [];
    }
  };

  const nextStep = () => {
    if (!isNextDisabled) {
      setActive((current) => (current < 2 ? current + 1 : current));
    }
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <ModalComp opened={open} close={close}>
        {mutate.isLoading ? (
          <LoaderWrapper>
            <Loader size="70" color="#fff" type="bars" />
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
                  <div>
                    <GenericBtn
                      title="Upload Marking Scheme"
                      onClick={handleMarkingSchemeFile}
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
                    {selectedFile && (
                      <Text
                        c={THEME.colors.text.primary}
                        sx={{ fontFamily: 'poppins, sans-serif' }}
                        ta="center"
                        fz="0.8rem"
                        fw={500}
                      >
                        {selectedFile}
                      </Text>
                    )}
                  </div>

                  {!selectedFile && (
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '90%',
                        }}
                      >
                        <div
                          style={{ textAlign: 'center', paddingTop: '1rem' }}
                        >
                          OR
                        </div>
                        <KeyheadStyles>
                          Select the correct answers
                        </KeyheadStyles>
                        <Group
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
                            Mark(s)
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
                        </Group>
                      </div>

                      <DisplayDivMultipleTimes />
                    </div>
                  )}
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
                      cursor: isNextDisabled ? 'not-allowed' : 'pointer',

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
                    onClick={() => handleSubmit(form.values)}
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
