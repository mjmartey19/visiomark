// Define ITableDataProps interface
export interface IStudentDataProps {
    file_name: string;
    predictions: { [key: number]: string } | string;
    score: number;
    index_number: string;
  }


 export interface ReadCSVFileProps {
    userId: string | undefined;
    name_of_file?: string;
  }