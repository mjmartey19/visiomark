import React from 'react';
import { GoogleLogin } from 'react-google-login';
import General from './general';
import { H2, MainContainer } from './styles';
import { Flex, Text } from '@mantine/core';
import { THEME } from '../../appTheme';
import { NavLink, useNavigate } from 'react-router-dom';

const BrowserLogin = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = (response:any) => {
    // Handle Google login response
    const profile = response.profileObj;
    const userInfo = {
      fullName: profile.name,
      profilePic: profile.imageUrl,
    };
    console.log(userInfo)
    // Save userInfo to localStorage or context/state
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    // Redirect to GoToDesktop page
    navigate('/go-to-desktop');
  };

  const handleLoginFailure = (response:any) => {
    console.log('Login failed:', response);
  };

  return (
    <General>
      <MainContainer>
        <Flex justify="center" align="center" direction="column">
          <H2>Sign in to VisioMark</H2>
          {/* <GoogleLogin
            clientId="931309954354-hgedvklrb9c4j9fqf7rdrp1jsrpku1qp.apps.googleusercontent.com"
            buttonText="Continue with Google"
            onSuccess={handleGoogleLogin}
            onFailure={handleLoginFailure}
            cookiePolicy={'single_host_origin'}
          /> */}
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

export default BrowserLogin;
