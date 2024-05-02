import { BaseDirectory, FileEntry, readDir } from '@tauri-apps/api/fs';
import Layout from '../common/components/Layout';
import { ScrollArea, Text, Button, Select } from '@mantine/core'; // Added Button for pagination
import { AllFilesContainer, StyledRefreshIcon, TitleStyles } from './styles';
import SharedCard from '../common/components/Card/card';
import { useState, useEffect } from 'react'; // Changed to useEffect
import { Constants } from '../../utils/constants';
import { THEME } from '../../appTheme';
import styled from 'styled-components';
import { sx } from '../common/components/layoutStyles';

const ITEMS_PER_PAGE = 8; // Number of items to show per page


type Entry = {
  name: string;
  entry: {
    path: string;
    name: string;
  };
  academic_year: string;
  marked_time: string;
};
const entries: Entry[] = [
  {
    name: 'COE 354_050.csv',
    entry: {
      path: '/path/to/file.txt',
      name: 'file.txt',
    },
    academic_year: '2023/2024',
    marked_time: '2 minutes ago',
  },
  {
    name: 'COE 324_050.csv',
    entry: {
      path: '/path/to/file.txt',
      name: 'file.txt',
    },
    academic_year: '2023/2024',
    marked_time: '1 day ago',
  },
  {
    name: 'COE 324_050.csv',
    entry: {
      path: '/path/to/file.txt',
      name: 'file.txt',
    },
    academic_year: '2023/2024',
    marked_time: '1 day ago',
  },
  {
    name: 'COE 324_050.csv',
    entry: {
      path: '/path/to/file.txt',
      name: 'file.txt',
    },
    academic_year: '2023/2024',
    marked_time: '1 day ago',
  },
  {
    name: 'COE 324_050.csv',
    entry: {
      path: '/path/to/file.txt',
      name: 'file.txt',
    },
    academic_year: '2023/2024',
    marked_time: '1 day ago',
  },
  {
    name: 'COE 324_050.csv',
    entry: {
      path: '/path/to/file.txt',
      name: 'file.txt',
    },
    academic_year: '2023/2024',
    marked_time: '1 day ago',
  },
  {
    name: 'COE 324_050.csv',
    entry: {
      path: '/path/to/file.txt',
      name: 'file.txt',
    },
    academic_year: '2023/2024',
    marked_time: '1 day ago',
  },
  {
    name: 'COE 324_050.csv',
    entry: {
      path: '/path/to/file.txt',
      name: 'file.txt',
    },
    academic_year: '2023/2024',
    marked_time: '1 day ago',
  },
  {
    name: 'COE 324_050.csv',
    entry: {
      path: '/path/to/file.txt',
      name: 'file.txt',
    },
    academic_year: '2023/2024',
    marked_time: '1 day ago',
  },
  {
    name: 'COE 324_050.csv',
    entry: {
      path: '/path/to/file.txt',
      name: 'file.txt',
    },
    academic_year: '2023/2024',
    marked_time: '1 day ago',
  },
];

const AllFiles = () => {
  const [allFiles, setAllFiles] = useState<Entry[]>(entries);
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // useEffect(() => {
  //   // Load files when component mounts
  //   async function loadFiles() {
  //     const entries = await readDir('visioMark', {
  //       dir: BaseDirectory.Document,
  //       recursive: true,
  //     });
  //     setAllFiles(entries);
  //   }
  //   loadFiles();
  // }, []); // Empty dependency array to run only once on mount

  const handleClick = () => {
    // Refresh the page
    window.location.reload();
  };

  const totalPages = Math.ceil(allFiles.length / ITEMS_PER_PAGE); // Calculate total pages

  // Pagination event handlers
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Calculate start and end indexes for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const courseOptions = Array.from({ length: 100 }, (_, i) => `COE ${i + 1}`);
  const departmentOptions = Array.from(
    { length: 100 },
    (_, i) => ` ${i + 100}`
  );
  const academicYearOptions = ['2022/2023', '2023/2024']; // Sample options for Academic Year filter

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
            c="#fff"
            sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
            ta="left"
            fz="2rem"
            fw={700}
          >
            All Files
          </Text>
          <StyledRefreshIcon size={20} onClick={handleClick} />
        </TitleStyles>
        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: '10px 15px 10px 0',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingBottom: '2rem' }}
            >
              <Text
                c="#fff"
                sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
                ta="left"
                fz="1rem"
              >
                Filtered by:
              </Text>
              {/* Dropdowns for filters */}

              <Select
                placeholder="Select Course Code"
                searchable
                data={courseOptions}
                value={selectedCourse}
                limit={5}
                sx={sx}
                onChange={(value) => setSelectedCourse(value)}
              />

              <Select
                placeholder="Select Department Code"
                searchable
                data={departmentOptions}
                value={selectedDepartment}
                limit={5}
                onChange={(value) => setSelectedDepartment(value)}
                style={{ minWidth: '150px' }}
                sx={sx}
              />
              <Select
                placeholder="Select Academic Year"
                searchable
                data={academicYearOptions}
                value={selectedYear}
                onChange={(value) => setSelectedYear(value)}
                style={{ minWidth: '150px' }}
                sx={sx}
              />
            </div>
            <AllFilesContainer>
              {/* Render items based on current page */}
              {entries.slice(startIndex, endIndex).map((entry, index) => (
                <SharedCard
                  key={index}
                  name_of_file={entry.name}
                  academic_year={entry.academic_year}
                  marked_time={entry.marked_time}
                  entry={entry}
                />
              ))}
            </AllFilesContainer>
          </div>
        </div>
        {/* Pagination controls */}
        <div
          style={{
            display: 'flex',
            width: '90%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Button
              onClick={prevPage}
              disabled={currentPage === 1}
              style={{
                fontSize: '0.8rem',
                fontWeight: 'bolder',
                color:  currentPage === totalPages ? '#000' : THEME.colors.text.primary,
                background:
                  currentPage === 1 ? THEME.colors.background.primary : '#fff',
              }}
            >
              Previous
            </Button>

            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              style={{
                fontSize: '0.8rem',
                fontWeight: 'bolder',
                color:  currentPage === totalPages ? THEME.colors.text.primary : '#000',
                background:
                  currentPage === totalPages
                    ? THEME.colors.background.primary
                    : '#fff',
              }}
            >
              Next
            </Button>
          </div>
          <span
            style={{
              margin: '0 0.6rem',
              color: THEME.colors.text.primary,
              fontSize: '0.8rem',
            }}
          >
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default AllFiles;
