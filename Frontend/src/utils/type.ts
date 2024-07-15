// Define ITableDataProps interface
export interface IStudentDataProps {
    file_name: string;
    predictions: { [key: number]: string };
    score: number;
    index_number: string;
  }