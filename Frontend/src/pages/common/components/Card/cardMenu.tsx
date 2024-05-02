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
import { IoMdShare } from "react-icons/io";

const SharedCardMenu = ({
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
    <div
      style={{
        position: 'absolute', 
        top: '0%', 
        right: '0' 
      }}
    >
      <Card
        sx={{
          background: THEME.colors.background.jet,
          color: '#fff',
          padding: '2rem',
          width: '13rem',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
          <IconStyles>
            <Tooltip
              label="Open file"
              withArrow
              position="left"
              // offset={-70}
              zIndex={500}
            >
              <IconContainer>
                <BiLinkExternal
                  size={20}
                  color='#fff'
                  onClick={() => openFile(entry.path)}
                  style={{ cursor: 'pointer' }}
                />
              </IconContainer>
            </Tooltip>

            <Tooltip label="Preview file" position="left">
              <IconContainer>
                <VscPreview
                  size={20}
                  color='#fff'
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    runReadCSVFile();
                  }}
                />
              </IconContainer>
            </Tooltip>

            <Tooltip label="Share file" position="left">
              <IconContainer>
                 <IoMdShare  size={20}  color='#fff' style={{ cursor: 'pointer' }} />
              </IconContainer>
            </Tooltip>

            <Tooltip label="Delete file" position="left">
              <IconContainer>
                <BiTrash size={20}  color='#fff' style={{ cursor: 'pointer' }} />
              </IconContainer>
            </Tooltip>
          </IconStyles>
     
      </Card>
    </div>
  );
};

export default SharedCardMenu;

const IconStyles = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const IconContainer = styled.div`
  background: red,
  padding: 0.6rem,
  border-radius: 10px;
`;
