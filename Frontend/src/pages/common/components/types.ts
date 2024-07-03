import { SelectItem } from '@mantine/core';

export type GenericInputProps = {
  placeholder: string;
  label: string;
  textInput?: boolean;
  description?: string;
  val_name: string;
  type?: React.HTMLInputTypeAttribute;
  data?: readonly (string | SelectItem)[];
};


export interface MarkingSchemeType {
  [key: number]: {
    correct: number;
    incorrect: number;
    isBonus: boolean;
    choice: string;
  };
}

export type MetadataType = {
  name_of_file: string;
  academic_year: string; 
  course_code: string;
  department_code: string
  createdAt: Date; 
  image_dir: string;
  marking_scheme: MarkingSchemeType
};