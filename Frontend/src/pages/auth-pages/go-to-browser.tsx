import General from './general';
import { H2, MainContainer } from './styles';
import GenericBtn from '../common/components/button';
import { Flex, Text } from '@mantine/core';
import { THEME } from '../../appTheme';
import { NavLink } from 'react-router-dom';


const GoToDesktop = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  const picture = urlParams.get('picture');

  const handleGoToDesktop = () => {
    const confirmation = window.confirm('Do you want to be redirected to the desktop application?');
    if (confirmation) {
      window.location.href = 'tauri://localhost/redirect?name=' + encodeURIComponent(name) + '&picture=' + encodeURIComponent(picture);
    }
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
          <GenericBtn
            title="Confirm and Go to Desktop"
            type="button"
            onClick={handleGoToDesktop}
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
        </Flex>
      </MainContainer>
    </General>
  );
};

export default GoToDesktop;
