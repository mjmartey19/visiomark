import styled from '@emotion/styled';
import { TextInput } from '@mantine/core';
import { THEME } from '../../appTheme';

export const TopbarContainer = styled.div`
  display: flex;
  padding: 0 1rem;
  justify-content: space-between;
  align-items: center;
  background-color:  ${THEME.colors.background.black};
  border-bottom: 1px solid ${THEME.colors.background.jet}
`;

export const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  height: calc(100vh - 5rem);
  align-Items: center;
`

export const H2 = styled.h2`
  font-family: poppins;
  text-align: center;
  line-height: 2rem;
  fo
`

export const LogoContainer = styled.div``;

export const Title = styled.p`
  font-family: Poppins;
`;


export const FormTitle = styled.div``;

export const InputWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top:2rem;
  width: 32rem;
`;

export const GenericTextInput = styled(TextInput)`
  & .mantine-inputWrapper {
    background-color: 'white';
  }

  & .mantine-inputWrapper-label {
    color: 'white';
  }
`;
