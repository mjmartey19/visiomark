import General from './general';
import { H2, MainContainer } from './styles';
import GenericBtn from '../common/components/button';
import { Flex, Text } from '@mantine/core';
import { THEME } from '../../appTheme';
import { NavLink } from 'react-router-dom';
import { open } from '@tauri-apps/api/shell';
import { shell } from '@tauri-apps/api';


const SignIn = () => {
  const handleBrowserLogin = async () => {
    await shell.open('http://localhost:1420/browser-login');
  };


  return (
    <General>
      <MainContainer>
        <Flex justify="center" align="center" direction="column">
          <H2>Sign in to VisioMark</H2>
          <GenericBtn
            title="Login with Browser"
            type="button"
            onClick={handleBrowserLogin}
            sx={{
              fontSize: '1rem',
              borderRadius: '20px',
              padding: '0 7rem',
              color: '#000000',
              background: '#fff',
              cursor: 'pointer',
              '&:hover': {
                background: THEME.colors.button.midnight_green,
              },
            }}
          />
          <Text style={{ paddingTop: '1rem' }}>
            No Account?{' '}
            <NavLink to={''} style={{ textDecoration: 'none', color: '#1976D2' }}>
              Create one
            </NavLink>
          </Text>
        </Flex>
      </MainContainer>
    </General>
  );
};

export default SignIn;
