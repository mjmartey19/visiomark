import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { THEME } from '../../../appTheme';

export const sx = {
  label: {
    color: THEME.colors.text.primary,
  },
  input: {
    background: THEME.colors.background.jet,
    color: THEME.colors.text.primary,
  },
};

export const Dashboardcontainer = styled.div`
  display: flex;
  flex-direction: column;
  gap-bottom: 1rem;
  height: 100vh;
`;

export const MainContainer = styled.div`
  display: flex;
  padding-top:2.5rem;
  gap-row: 2rem;
  height: 100%

`;

export const TopbarContainer = styled.div`
  display: flex;
  padding: 0 2rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid white
`;

export const SidebarContainer = styled.div`
  padding: 0 0.1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 20rem;
  height: 100%
`;



export const ContentContainer = styled.div`
  background-color:  ${THEME.colors.background.primary};
  width: 100%;
  height: auto;
  padding-left: 2rem;
  padding-right: 2rem
`;

export const LogoWrapper = styled.div`
  display: flex;
  gap: 0.8rem;
  padding: 0.5rem 1rem;
`;

export const Title = styled.p`
  font-family: poppins;
`;

export const Navigation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const NavLinks = styled(NavLink)`
  color: white;
  display: flex;
  gap: 1rem;
  align-items: center;
  text-decoration: none;
  font-size: 14px;
  padding: 0.5rem 1rem;

  &.active {
    background-color: ${THEME.colors.background.jet};
    border-radius: 20px;
  }
`;


export const UserDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background-color: ${THEME.colors.background.jet};
`;
