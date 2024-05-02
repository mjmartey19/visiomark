import { Flex, Group, Text } from '@mantine/core';
import { useState } from 'react';
import styled from 'styled-components';
import { THEME } from '../../appTheme';

const MasterKeyPage = ({
  question_number,
  all,
  setAll,
  index,
}: {
  question_number: number;
  setAll: React.Dispatch<React.SetStateAction<{}>>;
  all: { [key: number]: string };
  index: number;
}) => {
  const [clicked, setClicked] = useState(false);
  const [markValue, setMarkValue] = useState(1);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Flex
      gap={'sm'}
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
            background: `${THEME.colors.background.jet}`,
            padding: '4px',
            borderRadius: '20px',
            display: 'flex',
          }}
        >
          <ChoiceStyles
            clicked={all[question_number] === 'A'}
            onClick={() => {
              setAll({ ...all, [question_number]: 'A' });
              setClicked(!clicked);
            }}
          >
            A
          </ChoiceStyles>
          <ChoiceStyles
            clicked={all[question_number] === 'B'}
            onClick={() => {
              setAll({ ...all, [question_number]: 'B' });
              setClicked(true);
            }}
          >
            B
          </ChoiceStyles>
          <ChoiceStyles
            clicked={all[question_number] === 'C'}
            onClick={() => {
              setAll({ ...all, [question_number]: 'C' });
              setClicked(true);
            }}
          >
            C
          </ChoiceStyles>
          <ChoiceStyles
            clicked={all[question_number] === 'D'}
            onClick={() => {
              setAll({ ...all, [question_number]: 'D' });
              setClicked(true);
            }}
          >
            D
          </ChoiceStyles>
          <ChoiceStyles
            clicked={all[question_number] === 'E'}
            onClick={() => {
              setAll({ ...all, [question_number]: 'E' });
              setClicked(true);
            }}
          >
            E
          </ChoiceStyles>
        </div>
        <MarkStyle
          type="text"
          value={markValue}
          onChange={(e) => setMarkValue(parseInt(e.target.value))}
        />

        <CheckStyle
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        
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
  height: 2rem;
  display: flex;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
`;

const QuestionNumberStyles = styled.p`
  font-size: 1rem;
`;

const MarkStyle = styled.input`
  background: transparent;
  border: 1px solid ${THEME.colors.background.jet};
  color: ${THEME.colors.text.primary};
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding-left: 10px;
  margin-right: 0.5rem; /* Adjust as needed */
`;

const CheckStyle = styled.input`
  background: transparant;
  border: 1px solid ${THEME.colors.background.jet};
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 0.5rem; /* Adjust as needed */
`;
