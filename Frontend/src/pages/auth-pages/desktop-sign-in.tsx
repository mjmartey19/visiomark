import React, { useContext } from 'react';
import General from './general';
import { H2, MainContainer } from './styles';
import GenericBtn from '../common/components/button';
import { Flex, Text } from '@mantine/core';
import { THEME } from '../../appTheme';
import { useNavigate, NavLink } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import styled from 'styled-components';
import { appContext } from './../../utils/Context';

const SignIn = () => {
  const navigate = useNavigate();
  const { setUserDetails } = useContext(appContext);

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          access_token: codeResponse['access_token'],
        }),
      })
        .then(async (response) => await response.json())
        .then((data) => {
          console.log(data);
          setUserDetails({
            id: data.sub,
            name: data.name,
            email: data.email,
            picture: data.picture,
            access_token: codeResponse['access_token']
          });
          navigate('/home');
        });
    },
  });

  const handleLoginClick = () => {
    if (!navigator.onLine) {
      alert('No internet connection. Please connect to the internet to login.');
      return;
    }
    login();
  };

  return (
    <General>
      <MainContainer>
        <Flex justify="center" align="center" direction="column">
          <H2>Sign in to VisioMark</H2>
          
          <StyledButton
            title=""
            type="button"
            onClick={handleLoginClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="25" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path></svg>
            <span>Sign in with Google</span>
          </StyledButton>
          <Text style={{ paddingTop: '1rem' }}>
            No Account?{' '}
            <NavLink
              to={'/signup'}
              style={{ textDecoration: 'none', color: '#1976D2' }}
            >
              Create one
            </NavLink>
          </Text>
        </Flex>
      </MainContainer>
    </General>
  );
};

export default SignIn;

const StyledButton = styled.button`
  font-size: 1rem;
  border-radius: 20px;
  padding: 0.5rem 5rem;
  color: #000000;
  background: #fff;
  cursor: pointer;
  display: flex;
  gap: 1rem;
  align-items: center;
  font-weight: bold;
  &:hover {
    background: ${THEME.colors.button.midnight_green},
  }
`;
