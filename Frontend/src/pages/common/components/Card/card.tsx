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
import { readCSVFile, getMetadata } from '../../../../utils/helper';
import { useContext } from 'react';
import { appContext } from '../../../../utils/Context';
import { BsThreeDotsVertical } from 'react-icons/bs';
import SharedCardMenu from './cardMenu';
import moment from 'moment';


type MetadataType = {
  name_of_file: string;
  academic_year: string; 
  createdAt: string; 
};

const SharedCard = ({
  name_of_file,
  entry,
}: {
  name_of_file: string | undefined;
  entry: FileEntry;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [metadata, setMetadata] = useState<MetadataType | null>(null); // State should be an array of strings

  const fetchMetaData = async () => {
    try {
      const data: MetadataType = await getMetadata(name_of_file); // Fetch metadata
      setMetadata(data); 
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
    // console.log(metadata)
  };

  useEffect(() => {
    if (name_of_file) { 
      fetchMetaData();
    }
  }, [name_of_file]);

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
              {moment(metadata?.createdAt ).fromNow()}
            </Text>
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
      {isHovered && <SharedCardMenu name_of_file={entry.name} entry={entry} />}
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
