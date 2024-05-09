import useStatistics from '../hooks/useStatistics';
import Layout from '../../common/components/Layout';

import { StatsGrid } from './components/StatGrid';
import ScoreChart from './components/ScoreChart';
import { Badge, ScrollArea, Text } from '@mantine/core';
import { StatsSegments } from './components/StatsWithSegment';
import styled from 'styled-components';
import { THEME } from '../../../appTheme';

const Statistics = () => {
  const { summaryData, scores, a, numberOfQuestions, numberOfStudents } =
    useStatistics();
  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          height: 'calc(100% - 70px)',
        }}
      >
        <TitleStyle>
          <Text
            sx={{ fontFamily: 'Greycliff CF, sans-serif', color: `${THEME.colors.text.primary}` }}
            ta="left"
            fz="1rem"
            fw={700}
          >
            COE 354 Summary
          </Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Badge
              sx={{
                background: 'transparent',  
                color: `${THEME.colors.text.primary}`,
                padding: '1rem',
                border: `1px dashed ${THEME.colors.text.primary}`
              }}
            >
              {numberOfStudents} sheets
            </Badge>
            <Badge
               sx={{
                background: 'transparent',  
                color: `${THEME.colors.text.primary}`,
                padding: '1rem',
                border: `1px dashed ${THEME.colors.text.primary}`
              }}
            >
              {numberOfQuestions} Questions
            </Badge>
          </div>
        </TitleStyle>
        <ScrollArea
          style={{
            padding: '10px 0px 10px 0',
          }}
        >
          <div>
            <StatsGrid data={summaryData} />
           <div style={{
            marginTop: '1rem',
            border: `1px solid ${THEME.colors.background.jet}`,
            borderRadius: '10px',
            padding: '2rem'
           }}>
           <Text
              sx={{ fontFamily: 'Greycliff CF, sans-serif',   color: `${THEME.colors.text.primary}`,paddingLeft: '3.5rem', paddingBottom: '0.5rem' }}
              ta="left"
              fz="1rem"
              fw={700}
            >
              Score Visualization
            </Text>
            <ScoreChart scores={scores} />
           </div>
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
