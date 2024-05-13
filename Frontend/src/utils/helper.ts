import { useContext, useState } from 'react';
import { appContext } from './Context';
import { BaseDirectory, readTextFile, removeFile, writeTextFile } from '@tauri-apps/api/fs';
import { ITableDataProps } from '../pages/common/Table/types';

type MetadataType = {
  name_of_file: string;
  academic_year: string; 
  course_code: string;
  department_code: string;
  createdAt: Date; 
};

export const readCSVFile = async ({
  name_of_file,
}: {
  name_of_file?: string;
}) => {
  try {
    const result = await readTextFile(`visioMark\\result\\${name_of_file}`, {
      dir: BaseDirectory.Document,
    });
    const csvData = result.trim().split('\n');

      // Remove the first row (headers)
      csvData.shift();
      
    const data = csvData.map(row => {
      const rowData = row.split(',');
      const item = {
        file_name: rowData[0],
        predictions: rowData.slice(1, -2).join(',').replace(/^"(.*)"$/, '$1'), // Joining predictions separated by commas and remove qoute around it.
        score: Number(rowData[rowData.length - 2]), // Taking the second last element as score
        'index number': rowData[rowData.length - 1].trim(), // Trimming whitespace
      };
      return item;
    });
console.log(data)
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getMetadata = async (name_of_file?: string): Promise<MetadataType | null> => {
  try {
    if (!name_of_file) {
      throw new Error('File name is required');
    }

    // Read metadata CSV file
    const metadataResult = await readTextFile(`visioMark\\result\\metadata.csv`, {
      dir: BaseDirectory.Document,
    });

    const metadataCsvData = metadataResult.trim().split('\n');
    
    // Remove the first row (headers)
    metadataCsvData.shift();

    // Parse metadata CSV data
    const metadataData: MetadataType[] = metadataCsvData.map((row) => {
      const rowData = row.split(',');
      const item: MetadataType = {
        name_of_file: rowData[0],
        academic_year: rowData[1],
        course_code: rowData[2],
        department_code: rowData[3],
        createdAt: new Date(rowData[4].trim()), // Convert to Date object
      };
      return item;
    });

    // Find the metadata corresponding to the file name
    const metadata = metadataData.find((metadataItem) => metadataItem.name_of_file === name_of_file);

    return metadata || null; // Return null if metadata is not found
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteCSVFile = async (name_of_file: string | undefined) => {
  try {
    if (!name_of_file) {
      throw new Error('File name is required');
    }
    // Delete CSV file
    await removeFile(`visioMark\\result\\${name_of_file}`, {
      dir: BaseDirectory.Document,
    });

    // Read metadata file
    const metadataFilePath = `visioMark\\result\\metadata.csv`;
    const metadataContent = await readTextFile(metadataFilePath, {
      dir: BaseDirectory.Document,
    });

    // Remove the entry corresponding to the deleted CSV file
    const updatedMetadata = metadataContent
      .split('\n')
      .filter(line => !line.startsWith(name_of_file));

    // Write the updated metadata back to the file
    await writeTextFile(metadataFilePath, updatedMetadata.join('\n'), {
      dir: BaseDirectory.Document,
    });

    // console.log(`File ${name_of_file} deleted successfully.`);

    removeFromLocalStorage(name_of_file);
    // console.log(`File ${name_of_file} remove from local storage successfully.`);
    window.location.reload(); // Reload the page
  } catch (error) {
    console.error(`Error deleting file ${name_of_file}:`, error);
  }
};

export const getFilenamesFromLocalStorage = () => {
  const getStoredDataAsString = localStorage.getItem('recentFileNames');
  const getStoredData: Array<string> = getStoredDataAsString
    ? JSON.parse(getStoredDataAsString)
    : [];
  return getStoredData;
};

export const storeToLocalStorage = (fileName: string) => {
  const getStoredData = getFilenamesFromLocalStorage();
  getStoredData.unshift(fileName);

  const limitToTen = getStoredData.slice(0, 4);
  localStorage.setItem('recentFileNames', JSON.stringify(limitToTen));

  return getStoredData;
};

const removeFromLocalStorage = (fileName: string | undefined) => {
  if (!fileName) {
    throw new Error('File name is required');
  }
  const getStoredData = getFilenamesFromLocalStorage();
  const index = getStoredData.indexOf(fileName);
  if (index !== -1) {
    getStoredData.splice(index, 1);
  }

  const limitToTen = getStoredData.slice(0, 4);
  localStorage.setItem('recentFileNames', JSON.stringify(limitToTen));

};

export function convertToCountedObjects(
  numbers: number[]
): { value: number; count: number }[] {
  const countedObjects = numbers.reduce<{ [key: number]: number }>(
    (countMap, num) => {
      countMap[num] = (countMap[num] || 0) + 1;
      return countMap;
    },
    {}
  );

  return Object.entries(countedObjects).map(([value, count]) => ({
    value: Number(value),
    count,
  }));
}

function generateRandomHex(length: number): string {
  let result = '';
  const characters = '0123456789ABCDEF';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function countOccurenceofDifficultyLevel(
  difficultyLevels: string[]
): { label: string; count: number; color: string; part: number }[] {
  const countedObjects = difficultyLevels.reduce<{ [key: string]: number }>(
    (countMap, level) => {
      countMap[level] = (countMap[level] || 0) + 1;
      return countMap;
    },
    {}
  );

  return Object.entries(countedObjects).map(([value, count]) => ({
    label: value,
    count,
    part: (count / difficultyLevels.length) * 100,
    color: `#${generateRandomHex(6)}`,
  }));
}
interface DifficultyLevel {
  label: string;
  count: number;
  part: number;
  color: string;
}

export function calculateDifficultyLevels(
  scores: number[],
  totalPossibleScore: number
) {
  const easyScore = 0.8 * totalPossibleScore;
  const moderateScore = 0.5 * totalPossibleScore;

  const counts: { [label: string]: number } = {
    easy: 0,
    moderate: 0,
    difficult: 0,
  };

  scores.forEach((score) => {
    if (score >= easyScore) {
      counts.easy++;
    } else if (score >= moderateScore) {
      counts.moderate++;
    } else {
      counts.difficult++;
    }
  });

  const totalCount = scores.length;

  const data: DifficultyLevel[] = Object.entries(counts).map(
    ([label, count], index) => {
      return {
        label,
        count,
        part: Math.round((count / totalCount) * 100),
        color: `#${generateRandomHex(6)}`,
      };
    }
  );

  return data;
}

export function generateAcademicYears() {
  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
      const academicYear = `${year}/${year + 1}`;
      years.push(academicYear);
  }

  return years;
}


function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function generateCourseCodes() {
  const programs = [
    'PHY',
    'CE',
    'SP',
    'SOC',
    'ECON',
    'ENG',
    'MATH',
    'BIO',
    'CS',
    'PSY',
    'CHM',
    'BUS',
    'ART',
    'MECH',
    'HIST',
    'ARCH',
    'POLI',
    'LANG',
    'ELEC',
    'ANTH',
    'CHEM',
    'STAT',
    'PHIL',
    'COMM',
    'FIN',
    'GEOG',
    'LAW',
    'MED',
    'THEA',
    'NURS',
    'ECE',
    'ASTR',
    'CRM',
    'MKT',
    'GEO',
    'EDU',
    'GEOL',
    'ENVR',
    'COMP',
    'ARTH',
    'FNCE',
    'ESL',
    'LING',
    'HUM',
    'ACCT',
    'ME',
    'PSYC',
    'HOSP',
    'FREN',
    'ANAT',
    'LIT',
    'GERM',
    'RES',
    'JOUR',
    'AH',
    'REL',
    'PH',
    'BIOL',
    'IT',
    'KIN',
    'PHILO',
    'AGRI',
    'FLM',
    'EDD',
    'COM',
    'BUSI',
    'POLS',
    'SSCI',
    'ELT',
    'KINE',
    'MGT',
    'TH',
    'PSC',
    'PHL',
    'VET',
    'AE',
    'PLS',
    'CHE',
    'MEA',
    'CRJ',
    'A&S',
    'SOWK',
    'NUTR',
    'CST',
    'BME',
    'GS',
    'IEL',
    'AST',
    'PS',
    'PPE',
    'GE',
    'URP',
    'MSE',
    'WR',
    'CM',
    'IDS',
    'ELED',
    'CNST',
    'CEE',
    'BIOE',
    'RUS',
    'LSA',
    'CHBE',
    'ICS',
    'ANSC',
    'BINF',
    'AEM',
    'HDFS',
    'INTL',
    'LS',
    'GPH',
    'ASTRON',
    'MSENG',
    'DSGN',
    'ESE',
    'WGS',
    'HR',
    'GEOG/ENVS',
    'AHST',
    'BS',
    'US',
    'NRE',
    'GWS',
    'NEUR',
    'CJ',
    'RST',
    'CPLT',
    'SCLG',
    'IME',
    'CRS',
    'MEDH',
    'LSJ',
    'IB',
    'MCB',
    'AHS',
    'MUS',
    'GLG',
    'ED',
    'PSYCH',
    'BUSN',
    'OE',
    'HB',
    'MDVL',
    'PSIO',
    'PADM',
    'MA',
    'ID',
    'PLB',
    'AP',
    'CEP',
    'SJ',
    'BIOME',
    'APPL',
    'AB',
    'EAS',
    'CB',
    'APS',
    'EDP',
    'NS',
    'NAS',
    'DPS',
    'SCI',
    'RSM',
    'SOCW',
    'SOCIO',
    'SCB',
    'COGSCI',
    'SOCIOLOGY',
    'COE',
    'CEE',
    'EE',
    'ME',
    'BME',
    'IE',
    'CompE',
    'AE',
    'NRE',
    'NE',
    'CHE',
    'BSE',
    'MSE',
    'EnvE',
    'ChBE',
    'MatE',
    'WE',
    'SystemsE',
    'MSWE',
    'CEE',
    'AeroE',
    'GeosystemsE',
    'EnviroE',
    'PetE',
    'ArchE',
    'MEAM',
    'CS',
    'CIS',
    'NETS',
    'DS',
    'Robotics',
    'SCS',
    'MCS',
    'CIT',
    'IS',
    'IST',
    'InfoSec',
    'HC',
    'HCDS',
    'ESE',
    'DSGE',
    'ROBO',
    'ISD',
    'ROB',
    'MEM',
    'CADRE',
    'RBE',
    'HRD',
    'EED',
    'CPE',
    'CEM',
    'EIT',
    'AM',
    'CEng',
    'PE',
    'PME',
    'EPE',
    'ENE',
    'MSF',
    'HPC',
    'ST',
    'GIS',
    'QBA',
    'Econometrics',
    'RD',
    'EMS',
    'ERM',
    'MSC',
    'ESE',
    'EMSE',
    'CPS',
    'ES',
    'FSE',
    'AI',
    'CyberSec',
    'DCS',
    'AS',
    'BioE',
    'CEM',
    'ESTM',
    'RES',
    'GES',
    'SE',
    'SDM',
    'RE',
    'RESD',
    'UE',
    'BE',
    'SE',
    'SEIE',
    'SD',
    'MSP',
    'ESG',
    'SD',
    'ESD',
    'RESD',
    'MET',
    'ERP',
    'EPM',
    'CM',
    'IS',
    'PDM',
    'ME',
    'ISE',
    'ES',
    'EM',
    'MSI',
    'IM',
    'PMM',
    'PMT',
    'EA',
    'SER',
    'CME',
    'ERE',
    'HFE',
    'HM',
    'IS',
    'QM',
    'MSTE',
    'PDDM',
    'EMT',
    'CMT',
    'SEMS',
    'MSD',
    'EIS',
    'SIE',
    'ES',
    'ESE',
    'IME',
    'BE',
    'BME',
    'ISE',
    'IEOR',
    'EECS',
    'ISEM',
    'HFE',
    'CA',
    'BME',
    'CMT',
    'EMT',
    'EPM',
    'CSM',
    'SMM',
    'ECM',
    'MIS',
    'SSM',
    'IE',
    'IS',
    'PD',
    'ED',
    'IET',
    'AAM',
    'MSME',
    'EEM',
    'MSEM',
    'EMD',
    'MIS',
    'SDE',
    'MSDE',
    'EME',
    'ESD',
    'EDE',
    'EDEM',
    'EMT',
    'SE',
    'FSE',
    'ESM',
    'EST',
    'MSEM',
    'EM',
    'EME',
    'SE',
    'HMS',
    'SMS',
    'EMI',
    'MCI',
    'SDE',
    'MSC',
    'MSD',
    'MIM',
    'SE',
    'MSE',
    'SRE',
    'EME',
    'CMT',
    'EMI',
    'ESM',
    'MSC',
    'MSEM',
    'EMS',
    'EME',
    'EE',
    'SE',
    'MSE',
    'MSD',
    'EMI',
    'SMSE',
    'SDE',
    'MSDE',
    'EEM',
    'MIM',
    'EMT',
    'EM',
    'MSEM',
    'MIM',
    'EMI',
    'SMSE',
    'SDE',
    'MSDE',
    'SE',
    'EME',
    'MSE',
    'MSD',
    'EMI',
    'EMT',
    'EM',
    'MIM',
    'SMSE',
    'MSDE',
    'EEM',
    'EME',
    'MSEM',
    'SDE',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SE',
    'MSE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
    'EEM',
    'MSEM',
    'EMI',
    'SDE',
    'EM',
    'MSD',
    'MIM',
    'EMT',
    'EME',
    'SMSE',
    'MSDE',
  ];

  const years = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Years from 1 to 9
  const courseTypes = ['5', '6']; // Core and elective courses
  const semesters = [1, 2]; // Odd for first semester, even for second

  const courseCodes: Array<string> = [];

  // Generate course codes
  programs.forEach((program) => {
    years.forEach((year) => {
      courseTypes.forEach((type) => {
        semesters.forEach((semester) => {
          const code = `${program} ${year}${type}${semester}`;
          courseCodes.push(code);
        });
      });
    });
  });

  shuffleArray(courseCodes);

  return  courseCodes;
  ;
}

// const allCourseCodes = generateCourseCodes();

export function generateDepartmentCode() {
  const departmentCodes : Array<string> = [
    "010", //Electrical Engineering
    "050", //Computer Engineering
    "101", // Agricultural Economics, Agribusiness and Extension
    "102", // Agricultural Engineering
    "103", // Agriculture
    "201", // Architecture
    "301", // Biochemistry and Biotechnology
    "302", // Civil Engineering
    "303", // Computer Engineering
    "304", // Computer Science
    "305", // Construction Technology and Management
    "306", // Crop and Soil Sciences
    "307", // Electrical and Electronic Engineering
    "308", // Environmental Science
    "309", // Food Science and Technology
    "310", // Geography and Rural Development
    "311", // Geomatic Engineering
    "312", // Horticulture
    "313", // Hospitality and Tourism Management
    "314", // Industrial Art
    "315", // Industrial Mathematics
    "316", // Industrial Physics
    "317", // Landscape Design and Management
    "318", // Materials Engineering
    "319", // Mechanical Engineering
    "320", // Meteorology and Climate Science
    "321", // Natural Resources Management
    "322", // Petrochemical Engineering
    "323", // Petroleum Engineering
    "324", // Physics
    "325", // Publishing Studies
    "326", // Renewable Natural Resources
    "327", // Statistics
    "328", // Surveying and Geoinformatics
    "329", // Textile Design and Technology
    "330", // Urban Roads and Transport Engineering
    "331", // Water Resources Engineering
    "401", // Actuarial Science
    "402", // Banking and Finance
    "403", // Business Administration
    "404", // Human Resource Management
    "405", // International Business
    "406", // Logistics and Supply Chain Management
    "407", // Marketing
    "408", // Management Information Systems
    "409", // Entrepreneurship
    "410", // Estate Management
    "411", // Land Economy
    "412", // Quantity Surveying and Construction Economics
    "413", // Real Estate
    "414", // Telecommunication Engineering
    "415", // Chemical Engineering
    "416", // Chemistry
    "417", // Medical Laboratory Technology
    "418", // Nursing
    "419", // Physics
    "420", // Physiology
    "421", // Sports and Exercise Science
    "422", // Biochemistry
    "423", // Chemistry
    "424", // Geological Engineering
    "425", // Geology
    "426", // Mathematics
    "427", // Petrology
    "428", // Petrophysics
    "429", // Petroleum Geoscience
    "430", // Structural Engineering
    "431", // Telecommunications Engineering
    "432", // Textile Engineering
    "433", // Tourism and Hospitality Management
    "434", // Vehicle Engineering
    "435", // Veterinary Medicine
    "436", // Construction Management
    "437", // Finance
    "438", // Human Resource Development
    "439", // Information Technology
    "440", // Management Studies
    "441", // Marketing
    "442", // Supply Chain Management
    "443", // Land Administration
    "444", // Real Estate Management and Finance
    "445", // Agribusiness Management
    "446", // Agribusiness Management and Finance
    "447", // Landscape Architecture
    "448", // Human Settlement Planning
    "449", // Interior Architecture and Furniture Production
    "450", // Textile Design and Technology
    "451", // Fashion Design
    "452", // Industrial Engineering
    "453", // Water Supply and Environmental Sanitation
    "454", // Water and Environmental Engineering
    "455", // Soil and Water Engineering
    "456", // Rural and Community Development
    "457", // Building Technology
    "458", // Agricultural Engineering
    "459", // Agricultural Biotechnology
    "460", // Forestry
    "461", // Fisheries and Aquaculture Technology
    "462", // Wood Science and Technology
    "463", // Renewable Energy Technologies
    "464", // Dairy and Meat Science and Technology
    "465", // Food Quality Management
    "466", // Food Processing Engineering
    "467", // Seed Science and Technology
    "468", // Post Harvest Technology
    "469", // Industrial Mathematics
    "470", // Pure Mathematics
    "471", // Applied Mathematics
    "472", // Computational Mathematics
    "473", // Statistics
    "474", // Actuarial Science
    "475", // Mathematical Sciences
    "476", // Climate Science and Natural Resource Management
    "477", // Resource Enterprise and Entrepreneurship
    "478", // Land Use Planning
    "479", // Social Forestry and Environmental Governance
    "480", // Watershed Management and Ecohydrology
    "481", // Agroforestry and Environment
    "482", // Climate Change Adaptation and Mitigation
];

return departmentCodes;
}