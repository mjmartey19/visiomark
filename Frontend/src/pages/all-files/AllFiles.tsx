import { BaseDirectory, FileEntry, readDir } from '@tauri-apps/api/fs';
import Layout from '../common/components/Layout';
import { Text, Button, Select } from '@mantine/core'; 
import { AllFilesContainer, StyledRefreshIcon, TitleStyles } from './styles';
import SharedCard from '../common/components/Card/card';
import { useState, useEffect } from 'react'; 
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { generateDepartmentCode, getMetadata } from '../../utils/helper';
import { THEME } from '../../appTheme';
import styled from 'styled-components';
import { sx } from '../common/components/layoutStyles';
import { generateCourseCodes, generateAcademicYears } from '../../utils/helper';

const ITEMS_PER_PAGE = 8; // Number of items to show per page



const AllFiles = () => {
  const [allFiles, setAllFiles] = useState<FileEntry[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const entries = await readDir('visioMark\\result', {
        dir: BaseDirectory.Document,
        recursive: true,
      });
      setAllFiles(entries.filter(entry => entry.name !== 'metadata.csv'));
    };

    fetchFiles();
  }, []);
  
  useEffect(() => {
    const filterFiles = async () => {
      let filtered: (FileEntry | null)[] = [...allFiles];
  
      if (selectedCourse || selectedDepartment || selectedYear) {
        filtered = await Promise.all(
          allFiles.map(async (entry) => {
            const metadata = await getMetadata(entry.name);
            if (!metadata) return null;
  
            const { academic_year, course_code, department_code } = metadata;
            if (
              (!selectedCourse || course_code === selectedCourse) &&
              (!selectedDepartment || department_code === selectedDepartment) &&
              (!selectedYear || academic_year === selectedYear)
            ) {
              return entry;
            }
            return null;
          })
        );
      }
  
      // Type assertion here to tell TypeScript that filtered array contains only FileEntry elements
      setFilteredFiles(filtered.filter((entry): entry is FileEntry => entry !== null) as FileEntry[]);
    };
  
    filterFiles();
  }, [allFiles, selectedCourse, selectedDepartment, selectedYear]);
  

  const handleClick = () => {
    // Refresh the page
    window.location.reload();
  };

  const totalPages = filteredFiles ? Math.ceil(filteredFiles.length / ITEMS_PER_PAGE) : Math.ceil(allFiles.length / ITEMS_PER_PAGE); // Calculate total pages

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

  const courseOptions = generateCourseCodes();
  const departmentOptions = generateDepartmentCode();
  const academicYearOptions = generateAcademicYears();

  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // gap: '1rem',
          padding: '10px 0 0 0',
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
        <div style={{ flex: 1}}>
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
              {filteredFiles.slice(startIndex, endIndex).map((entry, index) => (
                <SharedCard key={index} name_of_file={entry.name} entry={entry} />
              ))}
            </AllFilesContainer>
          </div>
        </div>
        {/* Pagination controls */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex' }}>
            <Button
              onClick={prevPage}
              disabled={currentPage === 1}
              style={{
                fontSize: '0.8rem',
                color:  THEME.colors.text.primary,
                background: currentPage === 1 ? 'transparent' : 'transparent',
              }}
              sx={{ '&:hover': {
                border: `1px solid ${THEME.colors.background.primary}`,
              }}}
            >
              <MdKeyboardArrowLeft style={{marginRight: '0.4rem'}}/>  Previous
            </Button>

            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              style={{
                fontSize: '0.8rem',
                color:  THEME.colors.text.primary,
                background: currentPage === totalPages ? 'transparent' : 'transparent',
              }}
              sx={{'&:hover': {
                border: `1px solid ${THEME.colors.background.primary}`,
              }}}
            >
                Next <MdKeyboardArrowRight style={{marginLeft: '0.4rem'}}/>
            </Button>
          </div>
          <span
            style={{
              color: THEME.colors.text.primary,
              fontSize: '0.8rem',
              paddingRight: '8rem',
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
