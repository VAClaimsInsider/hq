import Box from '@mui/material/Box';
import { Link as MUILink, Typography } from '@mui/material';
import NextLink from 'next/link'
import { styled } from '@mui/material/styles';

const Wrapper = styled('div')(({ theme }) => ({
  gap: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
}));

export default function AccountMenu() {
  return (
    <Wrapper>
      <MUILink component={NextLink} href="/">Home</MUILink>
      <MUILink component={NextLink} href="/resources">Resources</MUILink>
      <MUILink component={NextLink} href="/procedure">Procedures</MUILink>
    </Wrapper>
  );
}