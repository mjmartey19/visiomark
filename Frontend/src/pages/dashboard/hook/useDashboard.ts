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

const useDashboard = () => {
  const [all, setAll] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<string | string[]>('');
  const folderPath = selectedFolder.toString().replace(/\\/g, '/');
  const navigate = useNavigate();
  const { setResponseData, setForPreview } = useContext(appContext);

  const getFilenamesFromLocalStorage = () => {
    const getStoredDataAsString = localStorage.getItem('recentFileNames');
    const getStoredData: Array<string> = getStoredDataAsString
      ? JSON.parse(getStoredDataAsString)
      : [];
    return getStoredData;
  };
  const storeToLocalStorage = (fileName: string) => {
    const getStoredData = getFilenamesFromLocalStorage();
    getStoredData.unshift(fileName);

    const limitToTen = getStoredData.slice(0, 4);
    localStorage.setItem('recentFileNames', JSON.stringify(limitToTen));

    return getStoredData;
  };

  const handleFolderSelect = async () => {
    const result = await dialog.open({
      multiple: false,
      directory: true,
      title: 'Select folder with scanned images',
    });

    if (result) {
      setSelectedFolder(result);
    }
  };

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
            master_key: { ...all },
          }),
        });


        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const responseData: [string, ITableDataProps[]] = await response.json();

        if (response.ok) {
          // close();
          
          storeToLocalStorage(responseData[0]);
          setResponseData(responseData[1]);
          setForPreview(true);
          AppAlert({
            title: 'Success',
            color: `${THEME.colors.button.primary}`,
            message: 'Marked Successfully!! 😁',
          });
          window.location.reload();
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(true);
        console.error('Validation error:', error);
      }
    }
  };

  return {
    all,
    setAll,
    handleFolderSelect,
    mutate,
    selectedFolder,
    validateData,
    getFilenamesFromLocalStorage,
  };
};

export default useDashboard;
