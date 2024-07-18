import React, { useContext, useEffect, useState } from 'react';
import { THEME } from '../../appTheme';
import SharedCard from '../common/components/Card/card';
import Layout from '../common/components/Layout';
import GenericBtn from '../common/components/button';
import { RFContent, RecentFiles, RequestBtn } from './styles';
import { useDisclosure } from '@mantine/hooks';
import Modalforms from './ModalForms';
import { readDir, BaseDirectory, FileEntry } from '@tauri-apps/api/fs';
import { ScrollArea, Text } from '@mantine/core';
import useDashboard from './hook/useDashboard';
import ensureDirectoriesExist from '../../utils/helper'; // Import the utility function
import { appContext } from '../../utils/Context';
import introJs from 'intro.js'

// Define the type for file entries
interface FileEntryWithOptionalName extends FileEntry {
  name?: string;
}

export const fetchEntries = async (userId: string): Promise<FileEntryWithOptionalName[]> => {
  // Construct the user-specific path
  const userResultPath = `VisioMark/${userId}/Result`;

  // Read the directory contents
  const entries = await readDir(userResultPath, {
    dir: BaseDirectory.Document,
    recursive: true,
  });

  return entries;
};

const Dashboard: React.FC = () => {
  const { userDetails } = useContext(appContext);
  const { getFilenamesFromLocalStorage } = useDashboard();
  const [opened, { open, close }] = useDisclosure(false);
  const [entries, setEntries] = useState<FileEntryWithOptionalName[]>([]);

  useEffect(() => {
    const initializeDirectoriesAndFetchEntries = async () => {
      await ensureDirectoriesExist(userDetails?.id); // Ensure directories exist on component mount
      if (userDetails?.id) {
        const fetchedEntries = await fetchEntries(userDetails.id); // Fetch entries after ensuring directories exist
        setEntries(fetchedEntries);
      }
    };



    initializeDirectoriesAndFetchEntries();
  }, [userDetails]);

  const recentFiles = getFilenamesFromLocalStorage();

  const findMatches = (): FileEntryWithOptionalName[] => {
    const matches = recentFiles.map((itemName) => {
      const matchedItems = entries.filter((item) => item.name === itemName);
      return matchedItems;
    });

    return matches.flat();
  };

  const recentEntries = findMatches();

  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: 'calc(100% - 64px)',
        }}
      >
        <Text
          c="#fff"
          sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
          ta="left"
          fz="2rem"
          fw={700}
        >
          Home
        </Text>
        <Text
          c={THEME.colors.text.primary}
          sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
          ta="left"
          fz="1rem"
          fw={500}
        >
          Welcome back, let’s get started
        </Text>

        {recentEntries.length === 0 ? (
          <div
            style={{
              paddingTop: '3rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            
          >
            <img src="/src/assets/home.svg" alt="logo" />
            <div
              style={{
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                alignContent: 'center',
                justifyContent: 'center',
                paddingBottom: '2rem',
              }}
             
            >
              <Text
                c="#fff"
                sx={{ fontFamily: 'poppins, sans-serif' }}
                fz="1.2rem"
                fw={500}
                ta="center"
              >
                No file uploaded yet
              </Text>

              <Text
                c={THEME.colors.text.primary}
                sx={{ fontFamily: 'poppins, sans-serif' }}
                ta="left"
                fz="0.9rem"
                fw={500}
              >
                Start the process of marking your sheets
              </Text>
            </div>

            <RequestBtn  className='introjs-1'>
            <Modalforms open={opened} close={close} />
              <GenericBtn
                type="button"
                title="Mark sheets"
                sx={{
                  borderRadius: '20px',
                  display: 'inline-block',
                  fontSize: '0.8rem',
                  fontWeight: 'bolder',
                  color: '#fff',
                  background: THEME.colors.background.jet,
                  '&:hover': {
                    background: THEME.colors.background.primary,
                  },
                }}
                onClick={open}
                
              />
            </RequestBtn>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                marginTop: '2rem',
                padding: '3rem 3rem',
                border: `2px dashed ${THEME.colors.background.jet}`,
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <RequestBtn>
                <Modalforms open={opened} close={close} />
                <GenericBtn
                  tooltip="Start Marking"
                  type="button"
                  title="Mark sheets"
                  sx={{
                    fontSize: '1rem',
                    borderRadius: '30px',
                    width: '10rem',
                    height: '4rem',
                    color: '#fff',
                    background: THEME.colors.background.jet,
                    '&:hover': {
                      background: THEME.colors.background.primary,
                    },
                  }}
                  onClick={open}
                />
              </RequestBtn>
              <Text
                c={THEME.colors.text.primary}
                sx={{ fontFamily: 'poppins, sans-serif' }}
                ta="left"
                fz="0.9rem"
                fw={500}
              >
                Start the process of marking your sheets
              </Text>
            </div>
            <RecentFiles>
              <Text
                c='#fff'
                sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
                ta="left"
                fz="1.2rem"
                fw={700}
              >
                RECENT FILES
              </Text>
              <div
                style={{
                  height: '27vh',
                  padding: '10px 15px 10px 0',
                }}
              >
                <RFContent>
                  {recentEntries.map((entry, index) => (
                    
                    <SharedCard
                      key={index}
                      name_of_file={entry.name}
                      entry={entry}
                    />
                  ))}
                </RFContent>
              </div>
            </RecentFiles>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
