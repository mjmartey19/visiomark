import ModalFull from '../common/Modal/ModalFull';
import { useEffect, useState } from 'react';

import {
  Group,
  Text,
} from '@mantine/core';
import { THEME } from '../../appTheme';
import GenericBtn from '../common/components/button';
import { ITableDataProps } from '../common/Table/types';

// Define props types
interface ModalPreviewProps {
  open: boolean;
  close: () => void;
  data: ITableDataProps;
}

const AnswerCard = ({ answer, color, number }: { answer: string; color: string; number: number }) => {
  return (
    <div style={{ display: 'inline-block', width: '10%', margin: '5px' }}>
      <div
        style={{
          backgroundColor: color,
          padding: '10px',
          textAlign: 'center',
          borderRadius: '5px',
        }}
      >
        <span style={{fontSize:'0.9rem', color:`${THEME.colors.background.primary}`}}>{`${number}. `}</span>
        {answer}
      </div>
    </div>
  );
};

const ModalPreview: React.FC<ModalPreviewProps> = ({ open, close, data}) => {
  const [page, setPage] = useState<number>(1);

  const answersPerPage = 56;

  // Function to generate a random answer ('A', 'B', 'C', or 'D')
  function generateRandomAnswer(): string {
    const answers: string[] = ['A', 'B', 'C', 'D', 'E'];
    const randomIndex: number = Math.floor(Math.random() * answers.length);
    return answers[randomIndex];
  }

  // Function to generate a marking scheme of 100 answers
  function generateMarkingScheme(): string[] {
    const markingScheme: string[] = [];
    for (let i: number = 0; i < 100; i++) {
      markingScheme.push(generateRandomAnswer());
    }
    return markingScheme;
  }

  // Function to compare student's answers with marking scheme and assign colors
  function compareAnswers(studentAnswers: string[], markingScheme: string[]): { answer: string; color: string }[] {
    const result: { answer: string; color: string }[] = [];
    for (let i: number = 0; i < studentAnswers.length; i++) {
      if (studentAnswers[i] === markingScheme[i]) {
        result.push({ answer: studentAnswers[i], color: '#006D32' });
      } else {
        result.push({ answer: studentAnswers[i], color: 'red' });
      }
    }
    return result;
  }
  
  // Generate marking scheme
  const markingScheme: string[] = generateMarkingScheme();

  // Example student's answers (replace with actual student's answers)
  const studentAnswers: string[] = [];
  for (let i: number = 0; i < 100; i++) {
    studentAnswers.push(generateRandomAnswer());
  }

  // Compare student's answers with marking scheme
  const result: { answer: string; color: string }[] = compareAnswers(studentAnswers, markingScheme);

  // Function to slice answers based on current page
  const slicedResult = result.slice((page - 1) * answersPerPage, page * answersPerPage);

  const totalPages = Math.ceil(result.length / answersPerPage);
  const nextStep = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const prevStep = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      <ModalFull opened={open} close={close}>
        <div style={{ display: 'flex', gap: '5rem', padding: '2rem 2rem 0 4rem' }}>
          <div style={{ padding: '2rem', background: THEME.colors.background.jet, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/src/assets/scan01.jpg" style={{ width: '23rem' }} alt="logo" />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap:'2rem', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight:'4rem', fontSize:'1.2rem' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <Text>Index number:</Text>
                <Text color={THEME.colors.text.primary}>{data['index number']}</Text>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <Text>Score:</Text>
                <Text color={THEME.colors.text.primary}>{data.score}</Text>
              </div>
            </div>
            <div style={{height: '25rem'}}>
              {slicedResult.map((answer, index) => (
                <AnswerCard key={index} answer={answer.answer} color={answer.color} number={index + 1 + (page - 1) * answersPerPage} />
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', gap:'0.5rem', justifyContent: 'flex-end', padding: '0 4rem 3rem 0' }}>
                <GenericBtn
                  title="Back"
                  type="button"
                  disabled={page === 1}
                  onClick={prevStep}
                  sx={{
                    fontSize: '0.8rem',
                    borderRadius: '20px',
                    padding: '0 3rem',
                    color:`${THEME.colors.background.jet }`,
                    background:  '#fff',
                    '&:hover': {
                      background: THEME.colors.text.primary,
                    },
                    '&:disabled': {
                      background: THEME.colors.background.jet, 
                      color: '#fff', 
                    },
                  }}
                />

                  <GenericBtn
                    title="Next"
                    type="button"
                    disabled={page === totalPages}
                    onClick={nextStep}
                    sx={{
                      fontSize: '0.8rem',
                      borderRadius: '20px',
                      padding: '0 3rem',
                      color:`${THEME.colors.background.jet }`,
                      background:  '#fff',
                      '&:hover': {
                        background: THEME.colors.text.primary,
                      },
                      '&:disabled': {
                        background: THEME.colors.background.jet, 
                        color: '#fff', 
                      },
                    }}
                  />
         
              </div>
            </div>
          </div>
        </div>
      </ModalFull>
    </>
  );
};

export default ModalPreview;
