import { useContext, useEffect, useState } from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { ITableDataProps, TableSortProps, ThProps } from './types';
import { BiChevronDown, BiChevronUp, BiSearch } from 'react-icons/bi';
import { HiSelector } from 'react-icons/hi';
import styled from 'styled-components';
import { appContext } from '../../../utils/Context';
import { isString } from '../../../utils/helper';
import { useMantineTheme } from '@mantine/core';
import { THEME } from '../../../appTheme';
import { FaEye } from "react-icons/fa6";
import { useDisclosure } from '@mantine/hooks';
import ModalComp from '../Modal/Modal';

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
    background: ``,
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: '#fff',
    '&:hover': {
      backgroundColor:'transparent',
      color: '#fff'
    },
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21),
  },
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor:THEME.colors.background.jet,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();


  const Icon = sorted ? (reversed ? BiChevronUp : BiChevronDown) : HiSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: ITableDataProps[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => {
      const value = item[key];
      if (isString(value)) {
        return value.toLowerCase().includes(query);
      }
      return value.toString().includes(query);
    })
  );
}

function sortData(
  data: ITableDataProps[],
  payload: {
    sortBy: keyof ITableDataProps | null;
    reversed: boolean;
    search: string;
  }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (isString(valueA) && isString(valueB)) {
        if (payload.reversed) {
          return valueB.localeCompare(valueA);
        }
        return valueA.localeCompare(valueB);
      }

      if (typeof valueA === typeof valueB) {
        return payload.reversed
          ? valueB > valueA
            ? -1
            : 1
          : valueA > valueB
          ? -1
          : 1;
      }

      return 0;
    }),
    payload.search
  );
}

function GenericTable({ data }: TableSortProps) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const theme = useMantineTheme();
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof ITableDataProps | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof ITableDataProps) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const handlePreview = (file_name: string) => {
    
  }

  const rows = sortedData.map((row) => {
    const [opened, { open, close }] = useDisclosure(false);
    return (
      <tr key={row.file_name}>
        <td>{row['index number']}</td>
        <PreictionDataRow>{row.predictions}</PreictionDataRow>
        <td style={{
          paddingLeft:'4rem'
        }}><Text style={{
          background: THEME.colors.background.jet, 
          padding: '0.4rem', 
          width: '6rem',
          textAlign: 'center',
          borderRadius: '4rem'
          }}>
            {row.score}
            </Text>
        </td>
        <td style={{
          paddingLeft:'7rem'
        }} >
            <ModalPreview open={opened} close={close} />
            Good Morning
          </ModalPreview>
          <FaEye size={20} style={{cursor: 'pointer'}} color={THEME.colors.text.primary} onClick={open} /></td>
      </tr>
    );
  });

  return (
    <ScrollArea
      h={'calc(100% - 70px)'}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <div
       style={{
        display:'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1rem',
       }} 
      >
        <Text
        style={{
          color: THEME.colors.text.primary
        }}
        >
           COE 354
        </Text>
      <TextInput
        placeholder="Search by index no."
        icon={<BiSearch size="1.2rem" color={THEME.colors.background.jet}/>}
        value={search}
        onChange={handleSearchChange}
        sx={{
          input: {
            background: 'transparent',
            height: '3rem',
            borderRadius: '0.6rem',
            width: '30rem',
            color: theme.colors.gray[0],
            border: `1px solid ${THEME.colors.background.jet}`,
            '&:focus': {
              border: `0.5px solid ${theme.colors.gray[6]}`, 
              outline: 'none', 
            },
            '::placeholder': { 
              color: theme.colors.gray[8],
            }
          },
        }}
      />
      </div>
      <Table
        horizontalSpacing="md"
        verticalSpacing="md"
        miw={700}
        sx={{ 
          tableLayout: 'fixed', 
          backgroundColor: 'transparents', 
          color: '#fff' ,
          border: `1px solid ${theme.colors.gray[8]}`,
        }}
        >
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
          <Th
              sorted={sortBy === 'index number'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('index number')}
            >
              Index Number
            </Th>

             <Th
              sorted={sortBy === 'predictions'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('predictions')}
            >
              Student Answers
            </Th>
           
            <Th
              sorted={sortBy === 'score'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('score')}
            >
              <Text style={{paddingLeft: '3rem'}}>Score</Text>
              
            </Th>
            <Th
              sorted={sortBy === 'file_name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('file_name')}
            >
              <Text style={{paddingLeft: '6rem'}}>
                  Preview
              </Text>
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}

export default GenericTable;

const PreictionDataRow = styled.td`
  white-space: nowrap;
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 10px; /* Width of the scrollbar */
    height: 9px;
    border-radius: 50%
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888; /* Color of the scrollbar thumb */
     border-radius: 5rem
  }

  &::-webkit-scrollbar-track {
    background-color: ${THEME.colors.background.jet}; /* Color of the scrollbar track */
        border-radius: 5rem
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* Color of the scrollbar thumb on hover */
  }

`;
