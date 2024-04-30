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

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
    background: ``,
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
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
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
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

  const rows = sortedData.map((row) => {
    return (
      <tr key={row.file_name}>
        <td>{row.file_name}</td>
        <PreictionDataRow>{row.predictions}</PreictionDataRow>
        <td>{row.score}</td>
        <td>{row['index number']}</td>
      </tr>
    );
  });

  return (
    <ScrollArea
      h={'calc(100% - 70px)'}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<BiSearch size="0.9rem" />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        sx={{ tableLayout: 'fixed', backgroundColor: 'aliceblue' }}
      >
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <Th
              sorted={sortBy === 'file_name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('file_name')}
            >
              File name
            </Th>
            <Th
              sorted={sortBy === 'predictions'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('predictions')}
            >
              Predictions
            </Th>
            <Th
              sorted={sortBy === 'score'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('score')}
            >
              Score
            </Th>
            <Th
              sorted={sortBy === 'index number'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('index number')}
            >
              Index Number
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
`;
