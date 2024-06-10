export interface ITableDataProps {
  file_name: string;
  predictions: string;
  score: number;
  'index number': string;
}

export interface TableSortProps {
  tdata: ITableDataProps[];
  csv_file_name: string
}

export interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}
