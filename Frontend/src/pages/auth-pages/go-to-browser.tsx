import General from './general';
import { H2, MainContainer } from './styles';
import GenericBtn from '../common/components/button';
import { Flex, Text } from '@mantine/core';
import { THEME } from '../../appTheme';
import { NavLink } from 'react-router-dom';

const GoBrowser = () => {
  const handleGoogleLogin = () => {
    // Perform Google OAuth here
    // You can use Google's JavaScript SDK or any other library for OAuth
  };

  return (
    <General>
      <MainContainer>
        <Flex justify="center" align="center" direction="column">
          <H2>Go to the Browser to <br /> continue login</H2>
          <Text style={{ paddingTop: '1rem' }}>
            Not seeing the browser tab?{' '}
            <NavLink to={''} style={{ textDecoration: 'none', color: '#1976D2' }}>
              Go back and try again
            </NavLink>
          </Text>
        </Flex>
      </MainContainer>
    </General>
  );
};

export default GoBrowser;
