import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  calculateDifficultyLevels,
  convertToCountedObjects,
} from '../../../../utils/helper';
import useStatistics from '../../hooks/useStatistics';

const ScoreChart = ({ scores }: { scores: Array<number> }) => {
  const data = convertToCountedObjects(scores);

  return (
    <LineChart width={900} height={400} data={data}>
      <Line type="monotone" dataKey="count" stroke="#8884d8" />
      <XAxis dataKey="value" stroke="#ffffff" />
      <YAxis stroke="#ffffff" />
      <Legend
        width={100}
        wrapperStyle={{
          top: -30,
          right: 20,
          backgroundColor: '#f5f5f5',
          border: '1px solid #d5d5d5',
          borderRadius: 3,
          lineHeight: '40px',
        }}
      />
      <Tooltip />
    </LineChart>
  );
};

export default ScoreChart;
