import {
  TopbarContainer,
  MainContainer,
  ContentContainer,
  Dashboardcontainer,
  LogoWrapper,
  NavLinks,
  Navigation,
  SidebarContainer,
  Title,
  UserDetails,
} from './layoutStyles';
import { Constants } from '../../../utils/constants';
import { BiHome } from 'react-icons/bi';
import { CgFileDocument } from 'react-icons/cg';
import { FiLogOut } from 'react-icons/fi';
import { FcStatistics } from 'react-icons/fc';
import { FiSettings } from 'react-icons/fi';
import { Avatar, Tabs } from '@mantine/core';
import { THEME } from '../../../appTheme';
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { StyledTabs } from './Tab';
import { VscPreview } from 'react-icons/vsc';
import GenericBtn from './button';
import Modalforms from '../../dashboard/ModalForms';
import { RequestBtn } from '../../dashboard/styles';
import { useDisclosure } from '@mantine/hooks';
import NotificationModal from '../notification/notification';
import { appContext } from '../../../utils/Context';
import { useContext, useEffect, useRef } from 'react';
import UserAvatar from './UserAvator';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { tabValue } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const { setUserDetails, userDetails } = useContext(appContext); 
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);  // Timer reference

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = 'src/assets/MarkingSchemeTemplate.xlsx';
    link.download = 'MarkingSchemeTemplate.xlsx';
    link.click();
  };

  // Utility function to get initials from a name
const getInitials = (name: string): string => {
  const nameParts = name.split(' ');
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  return initials;
};

  const logout = () => {
    setUserDetails(null);  // Clear user details from context
    localStorage.removeItem('userDetails');  // Remove user details from local storage
    navigate(Constants.PATHS.signIn);  // Redirect to login page
  };

  const resetInactivityTimeout = () => {
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }

    inactivityTimeout.current = setTimeout(logout, 60000*5);  // Set timeout to 1 minute (60000 ms)
  };

  useEffect(() => {
    const handleActivity = () => {
      resetInactivityTimeout();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    resetInactivityTimeout();  // Initial timeout setting

    return () => {
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  return (
    <Dashboardcontainer>
      <TopbarContainer>
        <LogoWrapper>
          <img src="/src/assets/logo.svg" width={30} alt="logo" />
          <Title>VisioMark</Title>
        </LogoWrapper>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <RequestBtn>
            <Modalforms open={opened} close={close} />
            <GenericBtn
              tooltip="Initiate Marking Process"
              type="button"
              title="Mark sheets"
              sx={{
                fontSize: '0.8rem',
                borderRadius: '20px',
                padding: '0 1rem',
                color: '#000000',
                background: '#fff',

                '&:hover': {
                  background: THEME.colors.button.midnight_green,
                },
              }}
              onClick={open}
            />
          </RequestBtn>
             <GenericBtn
              tooltip=""
              type="button"
              title="Exceptions(0)"
              sx={{
                fontSize: '0.8rem',
                borderRadius: '20px',
                padding: '0 1rem',
                color: '#fff',
                background: THEME.colors.background.jet,

                '&:hover': {
                  background: THEME.colors.background.primary,
                },
              }}
            />

          {/* <GenericBtn
            tooltip="Download MarkingScheme Template"
            type="button"
            title="Download Template"
            sx={{
              fontSize: '0.8rem',
              borderRadius: '20px',
              padding: '0 1.5rem',
              color: `#fff`,
              background: `${THEME.colors.background.jet}`,
              '&:hover': {
                background: THEME.colors.background.primary,
              },
            }}
            onClick={downloadTemplate}
          /> */}

        </div>
      </TopbarContainer>

      <MainContainer>
        <SidebarContainer>
          <Navigation>
            <UserDetails>
              <UserAvatar userDetails={userDetails} />
              <p style={{ fontSize: '1rem' }}>{userDetails?.name}</p>
            </UserDetails>
            <NavLinks to={`${Constants.PATHS.home}`} aria-label="link to home">
              <BiHome size={20} />
              Home
            </NavLinks>

            <NavLinks
              to={`${Constants.PATHS.allfiles}`}
              aria-label="shows all the files"
            >
              <CgFileDocument size={20} />
              All files
            </NavLinks>

            {pathname === `${Constants.PATHS.preview}` ||
            pathname === Constants.PATHS.statistics ? (
              <>
                <NavLinks
                  to={`${Constants.PATHS.preview}`}
                  aria-label="settings of the user"
                >
                  <VscPreview size={20} />
                  Preview
                </NavLinks>
                <NavLinks
                  to={`${Constants.PATHS.statistics}`}
                  aria-label="settings of the user"
                >
                  <FcStatistics size={20} />
                  Statistics
                </NavLinks>
              </>
            ) : null}
            <NavLinks
              to={`${Constants.PATHS.settings}`}
              aria-label="settings of the user"
            >
              <FiSettings size={20} />
              Settings
            </NavLinks>
          </Navigation>
          <NavLinks
            onClick={logout}  // Call handleLogout on click
            to={`${Constants.PATHS.signIn}`}
            aria-label="logout of the user"
          >
            <FiLogOut size={20} />
            Logout
          </NavLinks>
        </SidebarContainer>

        <ContentContainer>
          <div>
            {pathname === Constants.PATHS.preview ||
            pathname === Constants.PATHS.statistics ? (
              <StyledTabs
                defaultValue={
                  pathname === Constants.PATHS.preview
                    ? 'preview'
                    : 'statistics'
                }
                value={tabValue}
                onTabChange={(value) => navigate(`/${value}`)}
              >
                <Tabs.List>
                  <Tabs.Tab value="preview">Preview</Tabs.Tab>
                  <Tabs.Tab value="statistics">Statistics</Tabs.Tab>
                </Tabs.List>
              </StyledTabs>
            ) : null}
          </div>

          {children}
        </ContentContainer>
      </MainContainer>
    </Dashboardcontainer>
  );
};

export default Layout;
