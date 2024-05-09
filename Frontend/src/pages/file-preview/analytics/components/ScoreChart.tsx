import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  calculateDifficultyLevels,
  convertToCountedObjects,
} from '../../../../utils/helper';
import useStatistics from '../../hooks/useStatistics';
import { THEME } from '../../../../appTheme';

const ScoreChart = ({ scores }: { scores: Array<number> }) => {
  const data = convertToCountedObjects(scores);

  return (
    <LineChart width={900} height={350} data={data}>
      <Line type="monotone" dataKey="count" stroke="#006D32" />
      <XAxis dataKey="value" stroke="#ffffff" />
      <YAxis stroke="#ffffff" />
      <Legend
        width={100}
        wrapperStyle={{
          top: -40,
          right: 20,
          // backgroundColor: '#',
          color: '#fff',
          border: `1px solid ${THEME.colors.background.jet}`,
          borderRadius: 30,
          lineHeight: '40px',
        }}
      />
      <Tooltip />
    </LineChart>
  );
};

export default ScoreChart;
