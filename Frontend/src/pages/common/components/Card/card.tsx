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
import { readCSVFile } from '../../../../utils/helper';
import { useContext } from 'react';
import { appContext } from '../../../../utils/Context';
import { BsThreeDotsVertical } from "react-icons/bs";

const SharedCard = ({
  name_of_file,
  academic_year,
  marked_time,
  entry,
}: {
  name_of_file: string | undefined;
  academic_year: string | undefined;
  marked_time: string | undefined;
  entry: FileEntry;
  
}) => {
  const navigate = useNavigate();
  const openFile = async (path: string) => {
    await open(path);
  };
  const { setResponseData } = useContext(appContext);

  const runReadCSVFile = async () => {
    const data = await readCSVFile({ name_of_file });
    if (!data) return;
    setResponseData(data);
    navigate(`${Constants.PATHS.preview}`, { state: data });
  };

  return (
    <div>
      <Card
        sx={{
          background: THEME.colors.background.primary,
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
          <div style={{
            paddingTop: '1rem'
          }}>
          <Text
            size="md"
            color="#fff"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
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
            {academic_year}
          </Text>
          <Text
            size="xs"
            style={{
              display: 'flex',
              alignItems: 'center',
              color:`${THEME.colors.text.primary}`,
              gap: '1rem',
            }}
          >
            {marked_time}
          </Text>
          </div>

          {/* <IconStyles>
          <Tooltip label="Preview file" position="left">
            <IconContainer>
              <VscPreview
                size={20}
                color={`${THEME.colors.button.primary}`}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  runReadCSVFile();
                }}
              />
            </IconContainer>
          </Tooltip>
          <Tooltip
            label="Click to open file"
            withArrow
            position="left"
            // offset={-70}
            zIndex={500}
          >
            <IconContainer>
              <BiLinkExternal
                size={20}
                color={`${THEME.colors.button.primary}`}
                onClick={() => openFile(entry.path)}
                style={{ cursor: 'pointer' }}
              />
            </IconContainer>
          </Tooltip>
          <Tooltip label="Click to delete file" position="left">
            <IconContainer>
              <BiTrash size={20} color="red" style={{ cursor: 'pointer' }} />
            </IconContainer>
          </Tooltip>
        </IconStyles> */}
        </div>
        <div style={{
          cursor: 'pointer',
        }}>
            <BsThreeDotsVertical color='#fff'/>
        </div>
      </Card>
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
