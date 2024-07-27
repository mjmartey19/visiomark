import { THEME } from '../../appTheme';
import { LogoWrapper } from '../common/components/layoutStyles';
import {
  Title,
  TopbarContainer,
} from './styles';

const General = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{height: '100vh', background: `${THEME.colors.background.black}`}}>
      <TopbarContainer>
        <LogoWrapper>
          <img src="/src/assets/logo.png" width={30} height={30} alt="logo" />
          <Title>VisioMark</Title>
        </LogoWrapper>
      </TopbarContainer>
      {children}
    </div>
  );
};

export default General;
