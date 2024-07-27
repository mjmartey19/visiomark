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
import { useContext, useEffect, useRef, useState } from 'react';
import UserAvatar from './UserAvator';
import introJs from 'intro.js'
import 'intro.js/introjs.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { tabValue } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const { setUserDetails, userDetails } = useContext(appContext); 
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);  // Timer reference
  const [exceptionCount, setExceptionCount] = useState<number>(0);

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = 'src/assets/MarkingSchemeTemplate.xlsx';
    link.download = 'MarkingSchemeTemplate.xlsx';
    link.click();
  };
  useEffect(() => {
    const startTour = () => {
      const introElement1 = document.querySelector('.introjs-1') as HTMLElement | null;
      const introElement2 = document.querySelector('.introjs-2') as HTMLElement | null;
      const introElement3 = document.querySelector('.introjs-3') as HTMLElement | null;
      const introElement4 = document.querySelector('.introjs-4') as HTMLElement | null;
  
      if (introElement1 && introElement2 && introElement3 && introElement4) {
        const tour = introJs()
        tour.setOptions({
          steps: [
            {
              title: 'Explore VisioMark',
              intro: `Hi, ${userDetails?.name}. We are thrilled to have you on board.`,
            },
            {
              title: 'Mark Sheets',
              element: introElement1, // Ensure this selector matches the element
              intro: 'Begin the marking process by entering the Course course, Department Code, Academic Year,Total number of Questions and Uploading the folder containing scannable sheets. You can either upload a marking scheme in Excel format or select keys to mark the sheets.',
            },
            {
              title: 'Template',
              element: introElement2, 
              intro: 'Download the Marking Scheme Template to simplify the marking process. Upload this template instead of manually selecting keys during the marking process.',
            },
            {
              title: 'All Files',
              element: introElement3, // Ensure this selector matches the element
              intro: 'Access a comprehensive list of all marked results. This section provides easy review of previously marked sheets.',
            },
            {
              title: 'Settings',
              element: introElement4, // Ensure this selector matches the element
              intro: 'Configure settings to assign marks uniformly across all questions for consistent grading.',
            }
          ],
          
        });

        // Start the tour
        tour.start();

        // Save the tour shown status to local storage
        localStorage.setItem('tourShown', 'true');
      } else {
        setTimeout(startTour, 500); // Retry after 500ms if the element is not found
      }
    };

    // Check if the tour has been shown before
    const tourShown = localStorage.getItem('tourShown');

    if (!tourShown && userDetails) {
      setTimeout(startTour, 500);
    }
  }, [userDetails]);

  useEffect(() => {
    // Fetch exception count from localStorage when component mounts
    const storedExceptionCount = localStorage.getItem('exceptionCount');
    if (storedExceptionCount) {
      setExceptionCount(parseInt(storedExceptionCount, 10));
    }
  }, []);


  const logout = () => {
    setUserDetails(null);  // Clear user details from context
    localStorage.removeItem('userDetails');  // Remove user details from local storage
    navigate(Constants.PATHS.signIn);  // Redirect to login page
  };

  const resetInactivityTimeout = () => {
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }

    inactivityTimeout.current = setTimeout(logout, 60000*20);  // Set timeout to 1 minute (60000 ms)
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
          <img src="/src/assets/logo.png" width={30} alt="logo" />
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
          
          <div className='introjs-2'>
          <GenericBtn
            tooltip="Download MarkingScheme Template"
            type="button"
            title="Marking Scheme Template"
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
          />
          </div>

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
              className='introjs-3'
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
              className='introjs-4'
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
