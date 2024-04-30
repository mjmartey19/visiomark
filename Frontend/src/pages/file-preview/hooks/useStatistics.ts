import { useContext } from 'react';
import { appContext } from '../../../utils/Context';
import {
  calculateDifficultyLevels,
  countOccurenceofDifficultyLevel,
} from '../../../utils/helper';

const useStatistics = () => {
  const { responseData } = useContext(appContext);

  const getScores = () => {
    const scores: number[] = [];
    responseData.map((data) => scores.push(data.score));
    return scores;
  };
  const scores = getScores();

  const numberOfStudents = scores.length;

  const numberOfQuestions = responseData[0].predictions.split(' ').length;
  const listOfDifficultyLevel = calculateDifficultyLevels(
    scores,
    numberOfQuestions
  );

  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  const averageScore =
    scores.reduce((sum, score) => sum + score, 0) / scores.length;

  const variance =
    scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) /
    scores.length;

  const itemVariance = variance / numberOfQuestions;

  const totalVariance =
    scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) /
    (scores.length - 1);

  interface StatsItem {
    title: string;
    icon: 'average' | 'totalVariance' | 'minScore' | 'maxScore';
    value: string | number;
    diff: number;
  }

  const summaryData: StatsItem[] = [
    {
      title: 'Average Score',
      icon: 'average',
      value: averageScore.toFixed(2),
      diff: 34,
    },
    {
      title: 'Total Variance',
      icon: 'totalVariance',
      value: totalVariance.toFixed(2),
      diff: -13,
    },
    {
      title: 'Min Score',
      icon: 'minScore',
      value: minScore,
      diff: 18,
    },
    {
      title: 'Max Score',
      icon: 'maxScore',
      value: maxScore,
      diff: -30,
    },
  ];

  const a = {
    total: `Total: ${numberOfStudents}`,
    diff: 18,
    data: listOfDifficultyLevel,
  };

  const cronbachAlpha =
    (numberOfQuestions * itemVariance) /
    (itemVariance + (numberOfQuestions - 1) * totalVariance);
  console.log("Cronbach's Alpha:", cronbachAlpha);

  return {
    averageScore,
    cronbachAlpha,
    totalVariance,
    maxScore,
    minScore,
    scores,
    summaryData,
    numberOfQuestions,
    numberOfStudents,
    a,
  };
};

export default useStatistics;
