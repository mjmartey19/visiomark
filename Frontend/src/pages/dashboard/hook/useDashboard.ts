import { useMutation } from 'react-query';
import { Constants } from '../../../utils/constants';
import AppAlert from '../../common/notification/alert';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appContext } from '../../../utils/Context';
import { ITableDataProps } from '../../common/Table/types';
import { THEME } from '../../../appTheme';
import { schema } from '../schema';
import { z } from 'zod';
import { dialog } from '@tauri-apps/api';
import { getFilenamesFromLocalStorage, storeToLocalStorage } from '../../../utils/helper';
import { IAllData } from '../types';
import { rem } from '@mantine/core';
import { FiCheck } from 'react-icons/fi';

const useDashboard = () => {
  // State management
  const [all, setAll] = useState<IAllData>({});
  const [error, setError] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<string | string[]>('');
  const [exceptionCount, setExceptionCount] = useState<number>(0)
  // Convert selected folder path to a consistent format
  const folderPath = selectedFolder.toString().replace(/\\/g, '/');
  
  // Context state management
  const { setResponseData, setForPreview } = useContext(appContext);

  // Handle folder selection
  const handleFolderSelect = async () => {
    const result = await dialog.open({
      multiple: false,
      directory: true,
      title: 'Select folder with scanned images',
    });

    if (result) {
      setSelectedFolder(result);
      // console.log(result)
    }

  };

  console.log(all)
  // Mutation using react-query
  const mutate = useMutation({
    mutationFn: async (data: { [key: string]: string }) => {
      try {
        const response = await fetch(`${Constants.API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_dir: folderPath,
            no_of_questions: data['number_of_questions'],
            course_code: data['course_code'],
            department_code: data['department_code'],
            master_key: { ...all },
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const responseData: [string, ITableDataProps[]] = await response.json();
        if (response.ok) {
          storeToLocalStorage(responseData[0]);
          setResponseData(responseData[1]);
          setForPreview(true);

          AppAlert({
            title: 'Success',
            color: 'teal',
            message: 'Marked Successfully!! 😁',
          });

          // window.location.reload();
        }

        return responseData;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    },
  });

  const validateData = (data: any) => {
    try {
      schema.parse(data);
      setError(false);
      return true; // Return true if validation passes
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(true);
        console.error('Validation error:', error);
        alert('Invalid Or Empty Field(s), Please make sure all fields are valid or not empty');
      }
      return false; // Return false if validation fails
    }
  };

  return {
    all,
    setAll,
    handleFolderSelect,
    mutate,
    selectedFolder,
    error,
    validateData,
    getFilenamesFromLocalStorage,
  };
};

export default useDashboard;

