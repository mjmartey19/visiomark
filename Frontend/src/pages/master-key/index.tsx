import { Flex, Group, TextInput, Checkbox, rem } from '@mantine/core';
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
      </Group>
      <Group spacing='xl' style={{paddingLeft: '2rem'}}>
      <TextInput
          type="number"
          maxLength={1}
          value={1}
          
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
                  borderColor:'#fff'
              }
            },

            wrapper: {
              margin: '10px 0',
            },
          }}
        />

        {/* Checkbox for bonus */}
        <Checkbox
          label="Bonus"
          sx={{
            input: {
              background: 'transparent',
              border: `1px solid ${THEME.colors.background.jet}`,
            }
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

