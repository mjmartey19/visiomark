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

const SharedCard = ({
  name_of_file,
  entry,
}: {
  name_of_file: string | undefined;
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
    <div style={{ height: '3rem' }}>
      <Card
        sx={{
          background: THEME.colors.background.jet,
          color: THEME.colors.text.primary,
          borderLeft: '1px solid red',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          size="lg"
          color="cyan"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <FiFileText />
          {name_of_file}
        </Text>
        <IconStyles>
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
        </IconStyles>
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
