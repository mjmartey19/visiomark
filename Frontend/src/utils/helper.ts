import { useContext, useState } from 'react';
import { appContext } from './Context';
import { BaseDirectory, readTextFile } from '@tauri-apps/api/fs';
import { ITableDataProps } from '../pages/common/Table/types';

export const readCSVFile = async ({
  name_of_file,
}: {
  name_of_file?: string;
}) => {
  try {
    const result = await readTextFile(`visioMark\\${name_of_file}`, {
      dir: BaseDirectory.Document,
    });
    const csvData = result.split('\n');
    const data: ITableDataProps[] = [];
    for (const row of csvData) {
      const rowData = row.split(',');
      const item = {
        file_name: rowData[0],
        predictions: rowData[1],
        score: Number(rowData[2]),
        'index number': rowData[3],
      };
      data.push(item);
    }
    const newData = data.splice(-1, 1);
    return data.splice(1);
  } catch (error) {
    console.log(error);
    return;
  }
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
