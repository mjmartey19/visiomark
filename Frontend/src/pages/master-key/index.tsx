import { Flex, Group, TextInput, Checkbox } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { THEME } from '../../appTheme';

import { IAllData } from '../dashboard/types';
import { appContext } from '../../utils/Context';

interface MasterKeyPageProps {
  all: IAllData;
  setAll: React.Dispatch<React.SetStateAction<IAllData>>;
  question_number: number;
  index: number;
}

const MasterKeyPage: React.FC<MasterKeyPageProps> = ({ question_number, index, all, setAll }) => {
  const { correct, incorrect } = useContext(appContext);
  const initialCorrect = all[question_number]?.correct?.toString() || '';
  const initialIsBonus = all[question_number]?.isBonus || false;
  const initialChoice = all[question_number]?.choice || '';

  const [customCorrect, setCustomCorrect] = useState<string>(initialCorrect);
  const [isBonus, setIsBonus] = useState<boolean>(initialIsBonus);
  const [selectedChoice, setSelectedChoice] = useState<string>(initialChoice);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!all[question_number]) {
      setAll((prevState) => ({
        ...prevState,
        [question_number]: {
          correct: correct,
          incorrect,
          isBonus,
          choice: selectedChoice,
        },
      }));
    }
  }, [all, correct, incorrect, isBonus, question_number, selectedChoice, setAll]);

  const handleCorrectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomCorrect(value);
    if (value !== '') {
      const numericValue = Number(value);
      setAll((prevState) => ({
        ...prevState,
        [question_number]: {
          ...prevState[question_number],
          correct: numericValue,
        },
      }));
    }
  };

  const handleBonusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsBonus(checked);
    setAll((prevState) => ({
      ...prevState,
      [question_number]: {
        ...prevState[question_number],
        isBonus: checked,
      },
    }));
  };

  const handleChoiceClick = (choice: string) => {
    setSelectedChoice(choice);
    setAll((prevState) => ({
      ...prevState,
      [question_number]: {
        ...prevState[question_number],
        choice: choice,
      },
    }));
    setClicked(true);
  };

  return (
    <Flex
      gap={'xl'}
      justify="flex-start"
      align="flex-start"
      direction="row"
      wrap="wrap"
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <QuestionNumberStyles>{question_number}. </QuestionNumberStyles>
      <Group spacing={'xl'}>
        <div
          style={{
            padding: '4px',
            borderRadius: '50px',
            display: 'flex',
            gap: '4px'
          }}
        >
          {['A', 'B', 'C', 'D', 'E'].map((choice) => (
            <ChoiceStyles
              key={choice}
              clicked={selectedChoice === choice}
              onClick={() => handleChoiceClick(choice)}
            >
              {choice}
            </ChoiceStyles>
          ))}
        </div>
      </Group>
      <Group spacing='xl' style={{ paddingLeft: '2rem' }}>
        <TextInput
          type="number"
          maxLength={1}
          value={customCorrect}
          onChange={handleCorrectChange}
          styles={{
            input: {
              background: 'transparent',
              border: `1px solid ${THEME.colors.background.jet}`,
              color: `${THEME.colors.text.primary}`,
              width: '2.1rem',
              height: '2.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              '&:focus': {
                borderColor: '#fff',
              },
            },
            wrapper: {
              margin: '10px 0',
            },
          }}
        />
        <Checkbox
          label="Bonus"
          checked={isBonus}
          onChange={handleBonusChange}
          sx={{
            input: {
              background: 'transparent',
              border: `1px solid ${THEME.colors.background.jet}`,
            },
          }}
        />
      </Group>
    </Flex>
  );
};

export default MasterKeyPage;

const ChoiceStyles = styled.div<{ clicked?: boolean }>`
  background: ${({ clicked }) => (clicked ? THEME.colors.background.primary : 'transparent')};
  width: 5rem;
  height: 3rem;
  display: flex;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  border: 1px solid ${THEME.colors.background.primary};
`;

const QuestionNumberStyles = styled.p`
  font-size: 1.5rem;
`;
