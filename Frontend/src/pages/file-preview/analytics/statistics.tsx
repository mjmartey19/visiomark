import useStatistics from '../hooks/useStatistics';
import Layout from '../../common/components/Layout';

import { StatsGrid } from './components/StatGrid';
import ScoreChart from './components/ScoreChart';
import { Badge, ScrollArea, Text } from '@mantine/core';
import { StatsSegments } from './components/StatsWithSegment';
import styled from 'styled-components';

const Statistics = () => {
  const { summaryData, scores, a, numberOfQuestions, numberOfStudents } =
    useStatistics();
  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          height: 'calc(100% - 70px)',
        }}
      >
        <TitleStyle>
          <Text
            variant="gradient"
            gradient={{ from: '#ffff', to: 'cyan', deg: 45 }}
            sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
            ta="left"
            fz="2rem"
            fw={700}
          >
            STATISTICS
          </Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Badge
              variant="gradient"
              gradient={{ from: '#127474', to: '#ec69a6', deg: 35 }}
            >
              {numberOfStudents} sheets
            </Badge>
            <Badge
              variant="gradient"
              gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }}
            >
              {numberOfQuestions} Questions
            </Badge>
          </div>
        </TitleStyle>
        <ScrollArea
          style={{
            padding: '10px 15px 10px 0',
          }}
        >
          <div>
            <StatsGrid data={summaryData} />
            <Text
              variant="gradient"
              gradient={{ from: '#ffff', to: 'cyan', deg: 45 }}
              sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
              ta="left"
              fz="2rem"
              fw={700}
            >
              Score Visualization
            </Text>
            <ScoreChart scores={scores} />
            <StatsSegments data={a.data} diff={a.diff} total={a.total} />
          </div>
        </ScrollArea>
      </div>
    </Layout>
  );
};

export default Statistics;

const TitleStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 3rem;
  }
`;
