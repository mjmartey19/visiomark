import { Flex, Group } from '@mantine/core';
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
    clicked ? THEME.colors.button.primary : THEME.colors.button.midnight_green};
  width: 3rem;
  height: 3rem;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const QuestionNumberStyles = styled.p`
  font-size: 1.5rem;
`;
