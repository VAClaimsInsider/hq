import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import MainMenu from './MainMenu'

const Wrapper = styled('div')(({ theme }) => ({
  gap: theme.spacing(3),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: `${theme.spacing(5)} 0`,
}));

export default function Header() {
  return (
    <Container>
      <Wrapper>
        logo
        <MainMenu />
      </Wrapper>
    </Container>
  )
}
