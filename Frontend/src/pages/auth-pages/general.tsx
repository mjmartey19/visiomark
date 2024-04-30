import {
  LeftContainer,
  LogoContainer,
  MainContainer,
  RightContainer,
  Title,
} from './styles';

const General = ({ children }: { children: React.ReactNode }) => {
  return (
    <MainContainer>
      <LeftContainer>
        <LogoContainer>
          <Title>VisioMark</Title>
        </LogoContainer>
        <img src="/src/assets/logo.svg" alt="" width={500} />
      </LeftContainer>

      <RightContainer>{children}</RightContainer>
    </MainContainer>
  );
};

export default General;
