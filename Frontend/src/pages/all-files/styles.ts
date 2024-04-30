import { FiRefreshCw } from 'react-icons/fi';
import styled from 'styled-components';

export const AllFilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.7rem;
  height: 100%;
  /* padding: '40px 0'; */
`;

export const TitleStyles = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 1rem;
  cursor: pointer;
`;

export const StyledRefreshIcon = styled(FiRefreshCw)`
  transition: all;
  animation-duration: 2000;
  transition: 'transform 0.5s ease-in-out';
  &:hover {
    transform: rotate(180deg);
    color: red;
    font-size: 3rem;
  }
`;
