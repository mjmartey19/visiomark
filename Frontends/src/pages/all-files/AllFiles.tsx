import { BaseDirectory, FileEntry, readDir } from '@tauri-apps/api/fs';
import Layout from '../common/components/Layout';
import { ScrollArea, Text } from '@mantine/core';
import { AllFilesContainer, StyledRefreshIcon, TitleStyles } from './styles';
import SharedCard from '../common/components/Card/card';
import { useState } from 'react';

const entries = await readDir('visioMark', {
  dir: BaseDirectory.Document,
  recursive: true,
});

const AllFiles = () => {
  const [allFiles, setAllFiles] = useState<FileEntry[]>([]);

  const handleClick = () => {
    window.location.reload();
  };

  // (function processEntries(entries: FileEntry[]) {
  //   for (const entry of entries) {
  //     console.log(entry.children);
  //     if (entry.children) {
  //       setAllFiles((prev) => [...prev, entry]);
  //       processEntries(entries);
  //     }
  //   }
  // })(entries);

  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '10px 0',
          height: 'calc(100% - 70px)',
        }}
      >
        <TitleStyles>
          <Text
            variant="gradient"
            gradient={{ from: '#ffff', to: 'cyan', deg: 45 }}
            sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
            ta="left"
            fz="2rem"
            fw={700}
          >
            ALL FILES
          </Text>
          <StyledRefreshIcon size={25} onClick={handleClick} />
        </TitleStyles>
        <ScrollArea
          style={{
            // height: '39vh',
            padding: '10px 15px 10px 0',
          }}
        >
          <AllFilesContainer>
            {entries.map((entry, index) => (
              <SharedCard key={index} name_of_file={entry.name} entry={entry} />
            ))}
          </AllFilesContainer>
        </ScrollArea>
      </div>
    </Layout>
  );
};

export default AllFiles;
