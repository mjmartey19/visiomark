import { FiRefreshCw } from 'react-icons/fi';
import styled from 'styled-components';

export const AllFilesContainer = styled.div`
display: flex;
flex-wrap:wrap;
gap: 1.5rem;
`

export const TitleStyles = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 1rem;
`;

export const StyledRefreshIcon = styled(FiRefreshCw)`
  transition: all;
  animation-duration: 2000;
  transition: 'transform 0.5s ease-in-out';
  cursor: pointer;
  &:hover {
    transform: rotate(180deg);
    color: red;
    font-size: 3rem;
  }`;
