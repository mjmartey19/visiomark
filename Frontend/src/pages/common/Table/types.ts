export interface ITableDataProps {
  'index number': string;
  predictions: string;
  score: number;
  file_name: string;
  exceptions?: number; // Add this line
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
