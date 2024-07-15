import React, { useState, useEffect } from 'react';
import { Card, Text, Tooltip } from '@mantine/core';
import { THEME } from '../../../../appTheme';
import { FileEntry } from '@tauri-apps/api/fs';
import { open } from '@tauri-apps/api/shell';
import { FiFileText } from 'react-icons/fi';
import { BiLinkExternal, BiTrash } from 'react-icons/bi';
import { VscPreview } from 'react-icons/vsc';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Constants } from '../../../../utils/constants';
import { readCSVFile, getMetadata, getTotalExceptions } from '../../../../utils/helper';
import { useContext } from 'react';
import { appContext } from '../../../../utils/Context';
import { BsThreeDotsVertical } from 'react-icons/bs';
import SharedCardMenu from './cardMenu';
import moment from 'moment';
import { MetadataType } from '../types';
import { set } from 'zod';
import { ITableDataProps } from '../../Table/types';
import { IStudentDataProps } from '../../../../utils/type';



const SharedCard = ({
  name_of_file,
  entry,
}: {
  name_of_file: string | undefined;
  entry: FileEntry;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [metadata, setMetadata] = useState<MetadataType | null>(null);
  const [responseData, setResponseData] = useState<IStudentDataProps[]>([]);
  const [exceptionCount, setExceptionCount] = useState<number>(0)


  const handleMenuClick = () => {
    setIsHovered(false); // Reset hover state
  };

  const fetchMetaData = async () => {
    try {
      const data = await getMetadata(name_of_file); // Fetch metadata
      setMetadata(data); 
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }

  };

  const fetchResponseData = async () => {
    try {
      const data = await readCSVFile({ name_of_file})
    setResponseData(data);
    // console.log('Data', data)

    } catch (error) {
      console.error('Error fetching response data:', error);
    }
  }


  useEffect(() => {
    if (name_of_file) {
      fetchMetaData();
      fetchResponseData();
    }
  }, [name_of_file]);

  useEffect(() => {
    if (responseData) {
      const count = getTotalExceptions(responseData);
      console.log('COunt', count)
      
      setExceptionCount(count);
      // console.log('Count',count)
    }
  }, [responseData]);

  return (
    <div
      style={{
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
                maxWidth: '150px'
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
              Marked {moment(metadata?.createdAt ).fromNow()}
            </Text>
            <div  style={{
                display: 'flex',
                alignItems: 'center',
                color: `${THEME.colors.text.primary}`,
                justifyContent: 'space-between',
                background: THEME.colors.background.jet,
                marginTop: '0.6rem',
                borderRadius: '5rem',
                paddingLeft: '0.5rem'
              }}>
                <Text size="sm">
                   Exceptions 
                </Text>
                <Text style={{background: THEME.colors.background.primary, padding: '0.1rem 0.6rem ', borderRadius: '50%', color: 'red'}}>{exceptionCount}</Text>
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
      {isHovered && <SharedCardMenu name_of_file={entry.name} entry={entry} onMenuClick={handleMenuClick} />}
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
  /* gap: 1rem; */
  cursor: pointer;
`;
