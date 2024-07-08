import General from './general';
import { H2, MainContainer } from './styles';
import GenericBtn from '../common/components/button';
import { Flex, Text } from '@mantine/core';
import { THEME } from '../../appTheme';
import { NavLink, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

const BrowserSignup = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      fetch('http://127.0.0.1:8000/auth/userinfo', {
        method: 'POST',
        body: JSON.stringify({
          access_token: codeResponse['access_token'],
        }),
      })
        .then(async (response) => await response.json())
        .then((data) => {
          console.log(data);
          navigate('/home');
        });
    },
  });

  return (
    <General>
      <MainContainer>
        <Flex justify="center" align="center" direction="column">
          <H2>Sign up to VisioMark</H2>
          <GenericBtn
            title="Sign Up with Google"
            type="button"
            onClick={login}
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
            Already have an account?{' '}
            <NavLink to={'/'} style={{ textDecoration: 'none', color: '#1976D2' }}>
              Login
            </NavLink>

          </Text>
        </Flex>
      </MainContainer>
    </General>
  );
};

export default BrowserSignup;
