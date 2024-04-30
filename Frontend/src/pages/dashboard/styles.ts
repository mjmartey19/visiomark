import styled from 'styled-components';
import { THEME } from '../../appTheme';

export const RequestBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${THEME.colors.background.jet};
  margin-top: 0.4rem;
  border-radius: 20px;
  width: fit-content;
`;

export const RecentFiles = styled.div`
  margin-top: 2rem;
  width: 100%;
  height: 60%;
`;

export const Title = styled.p`
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2px;
`;

export const RFContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  height: 100%;
`;

export const ModalInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const LoaderWrapper = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const KeyheadStyles = styled.p`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
  text-align: center;
  color: ${THEME.colors.text.primary};
`;
