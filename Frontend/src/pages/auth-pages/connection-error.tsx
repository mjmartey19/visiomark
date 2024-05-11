import General from './general';
import { H2, MainContainer } from './styles';
import GenericBtn from '../common/components/button';
import { Flex, Text } from '@mantine/core';
import { THEME } from '../../appTheme';
import { NavLink } from 'react-router-dom';

const ConnectionError = () => {
  const handleGoogleLogin = () => {
    // Perform Google OAuth here
    // You can use Google's JavaScript SDK or any other library for OAuth
  };

  return (
    <General>
      <MainContainer>
        <Flex justify="center" align="center" direction="column">
          <h1>Connection error: -106</h1>
          <Text
            style={{
              width: '30rem',
              textAlign: 'center',
              color: THEME.colors.text.primary,
            }}
          >
            Your computer may be offline or the VisioMark server may be
            experiencing problems. VisioMark will automatically try to
            reconnect.
          </Text>

          <Flex gap="1rem" style={{ margin: '2rem 0' }}>
            <GenericBtn
              title="Try again"
              type="button"
              onClick={handleGoogleLogin}
              sx={{
                fontSize: '1rem',
                borderRadius: '20px',
                padding: '0 4rem',
                color: '#000000',
                background: '#fff',
                cursor: 'pointer',
                '&:hover': {
                  background: THEME.colors.button.midnight_green,
                },
              }}
            />
            <GenericBtn
              title="Close tab"
              type="button"
              onClick={handleGoogleLogin}
              sx={{
                fontSize: '1rem',
                borderRadius: '20px',
                padding: '0 4rem',
                color: '#fff',
                background: THEME.colors.background.primary,
                cursor: 'pointer',
                '&:hover': {
                  background: THEME.colors.background.jet,
                },
              }}
            />
          </Flex>
          <Flex
            direction="column"
            align='center'
            gap="1rem"
            color={`${THEME.colors.text.primary}`}
          >
            <Text>
              For help, visit help.VisioMark.com or contact
              support@visiomark.com.
            </Text>
            <Text>Error code: -106</Text>
            <Text style={{width: '30rem', textAlign: 'center'}}>
              Error navigating to 'https://www.visiomark.com':
              ERR_INTERNET_DISCONNECTED
            </Text>
          </Flex>
        </Flex>
      </MainContainer>
    </General>
  );
};

export default ConnectionError;
