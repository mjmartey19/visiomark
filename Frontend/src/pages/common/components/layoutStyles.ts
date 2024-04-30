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
  overflow: hidden;
`;


export const TopbarContainer = styled.div`
  display: flex;
  padding: 0 2rem;
  justify-content: space-between;
  align-items: center;
  background-color:  ${THEME.colors.background.black};
  border-bottom: 1px solid white
`;

export const MainContainer = styled.div`
  display: flex;
  gap-row: 2rem;
  height: calc(100vh - 5rem);
`;

export const SidebarContainer = styled.div`
  padding: 0 0.1rem;
  padding-top:2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  width: 20rem;
  padding-left: 3rem;
 padding-bottom: 1rem;
 background-color:  ${THEME.colors.background.black};
`;



export const ContentContainer = styled.div`
  background-color:  ${THEME.colors.background.black};
  width: 100%;
  height: auto;
  padding: 2.5rem 2rem 0 2rem
  
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
  gap: 1rem;
  
`;
