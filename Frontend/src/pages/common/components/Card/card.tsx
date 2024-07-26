import React, { useState, useEffect, useContext } from 'react';
import { Card, Text } from '@mantine/core';
import { THEME } from '../../../../appTheme';
import { FileEntry } from '@tauri-apps/api/fs';
import { FiFileText } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import styled from 'styled-components';
import moment from 'moment';
import { MetadataType } from '../types';
import { appContext } from '../../../../utils/Context';
import { readCSVFile, getMetadata, getTotalExceptions } from '../../../../utils/helper';
import SharedCardMenu from './cardMenu';
import { IStudentDataProps } from '../../../../utils/type';
import introJs from 'intro.js'
import 'intro.js/introjs.css';

const SharedCard = ({ name_of_file, entry }: { name_of_file: string | undefined; entry: FileEntry; }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [metadata, setMetadata] = useState<MetadataType | null>(null);
  const [responseData, setResponseData] = useState<IStudentDataProps[]>([]);
  const [exceptionCount, setExceptionCount] = useState<number>(0);
  const { userDetails } = useContext(appContext);

  const handleMenuClick = () => {
    setIsHovered(false); // Reset hover state
  };

  const fetchMetaData = async () => {
    try {
      if (name_of_file) {
        const data = await getMetadata({ userId: userDetails?.id, name_of_file }); // Fetch metadata
        setMetadata(data);
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

 
  
  const fetchResponseData = async () => {
    try {
      if (userDetails?.id && name_of_file) {
        const data = await readCSVFile({ userId: userDetails.id, name_of_file });
        const formattedData: IStudentDataProps[] = data?.map(item => ({
          file_name: item.file_name,
          predictions: item.predictions,
          score: item.score,
          index_number: item['index number']
        })) ?? [];
        setResponseData(formattedData);
        // console.log('Data', data);
      }
    } catch (error) {
      console.error('Error fetching response data:', error);
    }
  };


  useEffect(() => {
    if (name_of_file) {
      fetchMetaData();
      fetchResponseData();
    }
  }, [name_of_file]);

  useEffect(() => {
    if (responseData) {
      const count = getTotalExceptions(responseData);
      console.log('Count', count);
      setExceptionCount(count);
    }
  }, [responseData]);

useEffect(() => {
    const startTour = () => {
      const Card = document.querySelector('.file') as HTMLElement | null;
      const Exceptions = document.querySelector('.file-exceptions') as HTMLElement | null;
      const OpenFile = document.querySelector('.file-open') as HTMLElement | null;
 
      if (Card && Exceptions) {
        const tour = introJs()
        tour.setOptions({
          steps: [
            {
              title: 'Sheets Marked',
              intro: `Hi, ${userDetails?.name}. Congratulations on marking your first sheets!`,
            },
            {
              title: 'File',
              element: Card, // Ensure this selector matches the element
              intro: 'This section allows for easy review of your marked sheets.',
            },
            {
              title: 'Exceptions',
              element: Exceptions, // Ensure this selector matches the element
              intro: 'Here you can see the total number of exceptions raised by the model.',
            },
          ],
          
        });

        // Start the tour
        tour.start();

        // Save the tour shown status to local storage
        localStorage.setItem('cardTourShown', 'true');
      } else {
        setTimeout(startTour, 500); // Retry after 500ms if the element is not found
      }
    };

    // Check if the tour has been shown before
    const tourShown = localStorage.getItem('cardTourShown');

    if (!tourShown && userDetails) {
      setTimeout(startTour, 500);
    }
  }, [userDetails]);


  
  return (
    <div
      style={{
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className='file'
    >
      <Card
        sx={{
          background: THEME.colors.background.primary,
          border: `1px solid ${THEME.colors.background.jet}`,
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '2rem 1rem',
          width: '13rem',
        }}
        
      >
        <div>
          <div
            style={{
              padding: '0.6rem',
              width: 'fit-content',
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              borderRadius: '0.2rem',
              background: THEME.colors.background.jet,
            }}
           
          >
            <FiFileText size={20} />
          </div>
          <div
            style={{
              paddingTop: '1rem',
            }}
          >
            <Text
              size="md"
              color="#fff"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '150px',
              }}
            >
              {name_of_file}
            </Text>
            <Text
              size="sm"
              color="#fff"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              {metadata?.academic_year}
            </Text>
            <Text
              size="xs"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: `${THEME.colors.text.primary}`,
                gap: '1rem',
              }}
            >
              Marked {moment(metadata?.createdAt).fromNow()}
            </Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: `${THEME.colors.text.primary}`,
                justifyContent: 'space-between',
                background: THEME.colors.background.jet,
                marginTop: '0.6rem',
                borderRadius: '5rem',
                paddingLeft: '0.5rem',
              }}
              className='file-exceptions'
            >
              <Text size="sm">Exceptions</Text>
              <Text
                style={{
                  background: THEME.colors.background.primary,
                  padding: '0.1rem 0.6rem',
                  borderRadius: '50%',
                  color: '#fff',
                }}
              >
                {exceptionCount}
              </Text>
            </div>
          </div>
        </div>
        <div
          style={{
            cursor: 'pointer',
          }}
        >
          <BsThreeDotsVertical color="#fff" />
        </div>
      </Card>
      {isHovered && (
        <SharedCardMenu name_of_file={entry.name} entry={entry} onMenuClick={handleMenuClick} />
      )}
    </div>
  );
};

export default SharedCard;

const IconStyles = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
