import { THEME } from '../../appTheme';
import SharedCard from '../common/components/Card/card';
import Layout from '../common/components/Layout';
import GenericBtn from '../common/components/button';
import { RFContent, RecentFiles, RequestBtn } from './styles';
import { useDisclosure } from '@mantine/hooks';
import Modalforms from './ModalForms';
import { readDir, BaseDirectory } from '@tauri-apps/api/fs';
import { ScrollArea, Text } from '@mantine/core';

import useDashboard from './hook/useDashboard';

const entries = await readDir('visioMark', {
  dir: BaseDirectory.Document,
  recursive: true,
});


const recentEntry = [
  {
    name: 'COE 354_050.csv',
    entry: '',
    academic_year: '2023/2024',
    marked_time: '2 minutes ago'
  },
  {
    name: 'COE 324_050.csv',
    entry: '',
    academic_year: '2023/2024',
    marked_time: '1 days ago'
  },
  {
    name: 'COE 324_050.csv',
    entry: '',
    academic_year: '2023/2024',
    marked_time: '1 days ago'
  },
  {
    name: 'ME 304_156.csv',
    entry: '',
    academic_year: '2023/2024',
    marked_time: '2 days ago'
  },
]
const Dashboard = () => {
  const { getFilenamesFromLocalStorage } = useDashboard();
  const [opened, { open, close }] = useDisclosure(false);

  const recentFiles = getFilenamesFromLocalStorage();

  function findMatches() {
    const matches = recentFiles.map((itemName) => {
      const matchedItems = entries.filter((item) => item.name === itemName);
      // if (matchedItems.length === 0) {
      //   const filteredData = recentFiles.filter((item) => item !== itemName);
      //   localStorage.setItem('recentFileNames', JSON.stringify(filteredData));
      // }
      return matchedItems;
    });

    return matches.flat();
  }

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
          c="#CCCCCC"
          sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
          ta="left"
          fz="1rem"
          fw={500}
        >
          Welcome back, let’s get started
        </Text>

        {recentEntries ? (
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
                c="#CCCCCC"
                sx={{ fontFamily: 'poppins, sans-serif' }}
                ta="left"
                fz="0.9rem"
                fw={500}
              >
                Start the process of marking your sheets
              </Text>
            </div>

            <RequestBtn>
              <Modalforms open={opened} close={close} />
              <GenericBtn
                tooltip="Start the process of marking your files"
                type="button"
                title="Mark sheets"
                sx={{
                  borderRadius: '20px',
                  display: 'inline-block',
                  fontSize: '0.8rem',
                  fontWeight: 'bolder',
                  color: '#fff',
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
                  tooltip="Start the process of marking your files"
                  type="button"
                  title="Mark sheets"
                  sx={{
                    fontSize: '0.8rem',
                    borderRadius: '20px',
                    padding: '0 1rem',
                    color: '#fff',
                    fontWeight: 'bold',
                  }}
                  onClick={open}
                />
              </RequestBtn>
              <Text
                c="#CCCCCC"
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
              <ScrollArea
                style={{
                  height: '27vh',
                  padding: '10px 15px 10px 0',
                }}
              >
                <RFContent>
                  {recentEntry.map((entry, index) => (
                    <SharedCard
                      key={index}
                      name_of_file={entry.name}
                      academic_year={entry.academic_year}
                      marked_time={entry.marked_time}
                      entry={entry}
                    />
                  ))}
                </RFContent>
              </ScrollArea>
            </RecentFiles>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
