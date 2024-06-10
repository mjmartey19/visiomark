import { Flex, Group, TextInput, Checkbox, rem } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { THEME } from '../../appTheme';
import { appContext } from '../../utils/Context';
import useDashboard from '../dashboard/hook/useDashboard';


interface MasterKeyPageProps {
  question_number: number;
  index: number;
}


const MasterKeyPage: React.FC<MasterKeyPageProps> = ({ question_number, index }) => {
  const [clicked, setClicked] = useState(false);
  const { correct, incorrect } = useContext(appContext);
  const [isBonus, setIsBonus] = useState<boolean>(false);

  const {
    all,
    setAll
  } = useDashboard();

  useEffect(() => {
    // Sync correct and incorrect values in the all object
    setAll({
      ...all,
      [question_number]: {
        ...all[question_number],
        correct,
        incorrect,
        isBonus,
      }
    });
  }, []);

  console.log('all', all);
  const handleCorrectChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const value = parseInt(event.target.value);
    setAll({
      ...all,
      [question_number]: {
        ...all[question_number],
        correct: value,
        incorrect: incorrect
      }
    });
  
  };

  const handleBonusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsBonus(checked);
    setAll((prevAll) => ({
      ...prevAll,
      [question_number]: {
        ...prevAll[question_number],
        isBonus: checked,
      },
    }));
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
            background: `${THEME.colors.background.primary}`,
            padding: '4px',
            borderRadius: '50px',
            display: 'flex',
          }}
        >
       {['A', 'B', 'C', 'D', 'E'].map((choice) => (
            <ChoiceStyles
              key={choice}
              clicked={all[question_number]?.choice === choice}
              onClick={() => {
                setAll({
                  ...all,
                  [question_number]: {
                    ...all[question_number], // Spread existing data if any, or create a new object
                    choice: choice, // Update the choice
                  }
                });
                setClicked(true);
              }}
            >
              {choice}
            </ChoiceStyles>
            ))}
        </div>
      </Group>
      <Group spacing='xl' style={{paddingLeft: '2rem'}}>
      <TextInput
          type="number"
          maxLength={1}
          value={all[question_number]?.correct }
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

        {/* Checkbox for bonus */}
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

const ChoiceStyles = styled.div<{
  clicked?: boolean;
  index?: number;
  question_number?: number;
  onClick?: () => void;
}>`
  background: ${({ clicked, index, question_number }) =>
    clicked ? THEME.colors.background.black : ''};
  width: 5rem;
  height: 3rem;
  display: flex;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
`;

const QuestionNumberStyles = styled.p`
  font-size: 1.5rem;
`;

