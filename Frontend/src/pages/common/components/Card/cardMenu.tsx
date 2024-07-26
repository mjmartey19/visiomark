import { Card, Loader, Text, TextInput, Tooltip } from '@mantine/core';
import { THEME } from '../../../../appTheme';
import { FileEntry } from '@tauri-apps/api/fs';
import { open as openShell } from '@tauri-apps/api/shell';
import { FiFileText } from 'react-icons/fi';
import { BiLinkExternal, BiTrash } from 'react-icons/bi';
import { VscPreview } from 'react-icons/vsc';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Constants } from '../../../../utils/constants';
import { readCSVFile, deleteCSVFile } from '../../../../utils/helper';
import { useContext, useState } from 'react';
import { appContext } from '../../../../utils/Context';
import { LuShare } from 'react-icons/lu';
import ModalComp from '../../Modal/Modal';
import { useDisclosure } from '@mantine/hooks';
import GenericBtn from '../button';
import { sx } from '../layoutStyles';
import axios from 'axios';
import AppAlert from '../../notification/alert';


const SharedCardMenu = ({
  name_of_file,
  entry,
  onMenuClick,
}: {
  name_of_file: string | undefined;
  entry: FileEntry;
  onMenuClick: () => void;
}) => {
  const navigate = useNavigate();
  const openFile = async (path: string) => {
    await openShell(path);
  };
  const { setResponseData, userDetails } = useContext(appContext);
  const [shareOpened, { open: openShare, close: closeShare }] = useDisclosure(false); 
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const runReadCSVFile = async (userId: string | undefined, name_of_file: string | undefined) => {
    const data = await readCSVFile({ userId, name_of_file });
    if (!data) return;
    setResponseData(data);
    navigate(`${Constants.PATHS.preview}`, { state: { data, name_of_file } });
  };

  const sendCSVByEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/send-email', {
        sender_email: userDetails?.email,
        receiver_email: email,
        csv_path: entry.path
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Email sent successfully:", response.data);
      AppAlert({
        title: 'Success',
        color: 'teal',
        message: 'Email sent successfully!',
      });
      // closeShare();
    } catch (error) {
      console.error("Error sending email:", error);
      AppAlert({
        title: 'Error',
        color: 'red',
        message: 'Failed to send email.',
      });
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '0%',
        right: '0',
      }}
    >
      <Card
        sx={{
          background: THEME.colors.background.jet,
          color: '#fff',
          padding: '2rem',
          width: '13rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <IconStyles>
          <Tooltip
            label="Open file"
            withArrow
            position="left"
            zIndex={500}
          >
            <IconContainer>
              <BiLinkExternal
                size={20}
                color="#fff"
                onClick={() => openFile(entry.path)}
                style={{ cursor: 'pointer' }}
              />
            </IconContainer>
          </Tooltip>

          <Tooltip label="Preview file" position="left">
            <IconContainer>
              <VscPreview
                size={20}
                color="#fff"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  runReadCSVFile(userDetails?.id, name_of_file);
                }}
              />
            </IconContainer>
          </Tooltip>

          <Tooltip label="Share file" position="left">
            <IconContainer>
              <ModalComp opened={shareOpened} close={closeShare}>
                <div>
                  <Text
                    sx={{
                      fontSize: '1.5rem',
                      borderBottom: `1px solid ${THEME.colors.background.primary}`,
                      paddingBottom: '1rem',
                    }}
                  >
                    Share File
                  </Text>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    paddingTop: '2rem',
                  }}>
                    <TextInput
                      placeholder="Enter email address"
                      value={email}
                      onChange={(event) => setEmail(event.currentTarget.value)}
                      sx={sx}
                      style={{ width: '100%' }}
                    />
                      {!loading ? (
                    <GenericBtn
                      title="Share"
                      type="button"
                      onClick={sendCSVByEmail}
                      sx={{
                        fontSize: '0.8rem',
                        borderRadius: '20px',
                        padding: '0 3rem',
                        color: '#000000',
                        background: '#fff',
                        cursor: 'pointer',
                        '&:hover': {
                          background: THEME.colors.button.midnight_green,
                        },
                      }}
                    />
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                      <Loader color="#fff" size={50}/>
                    </div>
                  )}
                  </div>
                              
                </div>
              </ModalComp>
              <LuShare size={20} color="#fff"  
                       style={{ cursor: 'pointer' }}
                       onClick={openShare}
              />
            </IconContainer>
          </Tooltip>

          <Tooltip label="Delete file" position="left">
            <IconContainer>
              <ModalComp opened={deleteOpened} close={closeDelete}>
                <div>
                  <Text
                    sx={{
                      fontSize: '1.5rem',
                      borderBottom: `1px solid ${THEME.colors.background.primary}`,
                      paddingBottom: '1rem',
                    }}
                  >
                    Delete File
                  </Text>
                  <Text
                    sx={{
                      color: `${THEME.colors.text.primary}`,
                      fontSize: '1rem',
                      paddingTop: '1rem',
                    }}
                  >
                    This will delete{' '}
                    <span style={{ color: 'red' }}>{name_of_file} File</span>
                  </Text>
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingTop: '2rem',
                  }}>
                    <GenericBtn
                      title="Cancel"
                      type="button"
                      onClick={() => {
                        closeDelete();
                        onMenuClick();
                      }}
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
                    <GenericBtn
                      title="Delete"
                      type="button"
                      onClick={() => {
                        deleteCSVFile({ userId: userDetails?.id, name_of_file } );
                      }}
                      sx={{
                        fontSize: '0.8rem',
                        borderRadius: '20px',
                        padding: '0 3rem',
                        color: `#fff`,
                        background: `red`,
                        '&:hover': {
                          opacity: '0.9',
                          background: 'red',
                        },
                      }}
                    />
                  </div>
                </div>
              </ModalComp>
              <BiTrash
                size={20}
                color="#fff"
                style={{ cursor: 'pointer' }}
                onClick={openDelete}
              />
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


