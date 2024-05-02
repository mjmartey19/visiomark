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
import { FiLogOut } from "react-icons/fi";
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

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { tabValue } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Dashboardcontainer>
      <TopbarContainer> 
        <LogoWrapper>
            <img src="/src/assets/logo.svg" width={30} alt="logo" />
            <Title>VisioMark</Title>
          </LogoWrapper>

          <div style={
           {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
           }
          }> 
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
                  color:  '#000000',
                  background: '#fff',
                  
                  '&:hover': {
                    background: THEME.colors.button.midnight_green,
                  },
                }}
                onClick={open}
              />
            </RequestBtn>

            <GenericBtn
                tooltip="Help"
                type="button"
                title="Help"
                sx={{
                  fontSize: '0.8rem',
                  borderRadius: '20px',
                  padding: '0 1.5rem',
                  color:   `#fff`,
                  background: `${THEME.colors.background.jet}`,
                  '&:hover': {
                    background: THEME.colors.background.primary,
                  },
                }}
              />

          </div>
      </TopbarContainer>
      
      <MainContainer>
          <SidebarContainer>  
            <Navigation>
             <UserDetails>
                <Avatar
                  radius="xl"

                  styles={{
                    placeholder: {
                      color: '#fff',
                      backgroundColor: `${THEME.colors.background.jet}`,
                      fontSize: '0.8rem',
                    },
                  }}
                >
                  EA
                </Avatar>
                <p style={{ fontSize: '0.8rem'}}>Emmanuel Akowuah</p>
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
            <NavLinks to={`${Constants.PATHS.logout}`}
             aria-label="settings of the user"
            >

              <FiLogOut size={20}  />
              Logout
            </NavLinks>
          </SidebarContainer>

          <ContentContainer>
        
              <div>
                {pathname === Constants.PATHS.preview ||
                pathname === Constants.PATHS.statistics ? (
                  <StyledTabs
                    defaultValue={'preview'}
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
