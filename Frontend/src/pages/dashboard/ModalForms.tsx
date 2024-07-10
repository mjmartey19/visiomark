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
  const [isNextDisabled, setIsNextDisabled] = useState<boolean>(true);
  const { handleFolderSelect, mutate, all, setAll, selectedFolder, validateData } = useDashboard();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { incorrect } = useContext(appContext);
  const [markingSchemeLength, setMarkingSchemeLength] = useState<number>(0);

  const form: UseFormReturnType<any, (values: any) => typeof schema> = useUserForm({
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

  const handleMarkingSchemeFile = async () => {
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
  
      try {
        const arrayBuffer = await readBinaryFile(filePath);
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
  
        if (jsonData.length === 0) {
          throw new Error("The uploaded file is empty.");
        }
  
       // Convert object keys to lowercase
       const lowerCaseKeys = (obj: any) =>
        Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]));

      const firstRowLowerCase = lowerCaseKeys(jsonData[0]);
      const requiredColumns = ['choice', 'marks', 'bonus'];
      const missingColumns = requiredColumns.filter(column => !firstRowLowerCase.hasOwnProperty(column));

      if (missingColumns.length > 0) {
        throw new Error(`The uploaded file is missing the following columns: ${missingColumns.join(', ')}`);
      }
  
        const formattedData: IAllData = {};
        jsonData.forEach((row, index) => {
          if (typeof row.Choice !== 'string' || typeof row.Marks !== 'number' || typeof row.Bonus !== 'boolean') {
            throw new Error(`Invalid data format in row ${index + 1}.`);
          }
          formattedData[row.__rowNum__] = {
            choice: row.Choice || '',
            correct: row.Marks,
            incorrect: incorrect,
            isBonus: row.Bonus
          };
        });
  
        setAll(formattedData);
        setMarkingSchemeLength(Object.keys(formattedData).length);
      } catch (error:any) {
        alert(`Error: ${error.message}`);
        setSelectedFile(null);
      }
    }
  };
  

  const DisplayDivMultipleTimes = () => {
    const divs = [];
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
  };

  const handleSubmit = (values: any) => {
    const isValid = validateData(form.values);
    if (!isValid) {
      return;
    }
    if (markingSchemeLength !== 0) {
      if (parseInt(values.number_of_questions) !== markingSchemeLength) {
        alert("The number of questions does not match the length of the uploaded file data.");
        return;
      }
    }
    mutate.mutate(values);
  };

  const nextStep = () => {
    const isValid = validateData(form.values);
    if (isValid && !isNextDisabled) {
      setActive((current) => (current < 2 ? current + 1 : current));
    }
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

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
            <form onSubmit={form.onSubmit(handleSubmit)}>
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
                      {...form.getInputProps('department_code')}
                      placeholder="050"
                      val_name="department_code"
                      label="Department code"
                      type="number"
                    />
                  </ModalInputs>
                </Stepper.Step>
                <Stepper.Step>
                  <ModalInputs>
                    <GenericInput
                      {...form.getInputProps('number_of_questions')}
                      placeholder="40"
                      val_name="number_of_questions"
                      label="Total number of questions"
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
                        <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
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