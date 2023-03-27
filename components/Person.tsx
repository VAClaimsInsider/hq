import { Avatar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface IPerson {
  name: string,
  image: string,
  size?: 1|2|3,
}

const Item = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const Person = ({ name, image, size = 2 }: IPerson) => {
  const px = (size * 16) + 8;
  const sx = { width: px, height: px };
  return (
    <Item>
      {image ?
        <Avatar sx={sx} src={image} alt={`Profile photo of ${name}`} />
        : <Avatar sx={sx}>{name[0]}</Avatar>
      }
      <Typography variant='body1'>{name}</Typography>
    </Item>
  );
}

export default Person;