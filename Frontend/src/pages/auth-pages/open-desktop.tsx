import General from './general';
import { H2, MainContainer } from './styles';
import GenericBtn from '../common/components/button';
import { Flex, Text } from '@mantine/core';
import { THEME } from '../../appTheme';
import { NavLink } from 'react-router-dom';

const OpenDesktop = () => {
  const handleGoogleLogin = () => {
    // Perform Google OAuth here
    // You can use Google's JavaScript SDK or any other library for OAuth
  };

  return (
    <General>
      <MainContainer>
        <Flex justify="center" align="center" direction="column">
          <H2>Log in as <br />
          schorlar2468@gmail.com
          </H2>
          <GenericBtn
            title="Open the Desktop App"
            type="button"
            onClick={handleGoogleLogin}
            sx={{
              fontSize: '1rem',
              fontFamily: 'Plus Jakarta Sans',
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
            No schorlar2468@gmail.com?{' '}
            <NavLink to={''} style={{ textDecoration: 'none', color: '#1976D2' }}>
              Login with another account
            </NavLink>
          </Text>
        </Flex>
      </MainContainer>
    </General>
  );
};

export default OpenDesktop;
