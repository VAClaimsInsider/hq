import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button, Card, CardActions, CardContent, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import Layout from '../../components/Layout'
import client from '../../client'
import Person from '../../components/Person'

interface IItems {
  title: string,
  summary: string,
  department: IDepartment,
  slug: string,
  person: {
    name: string,
    image?: string,
  },
  tags: { title: string, slug: string }[]
}

interface IDepartment {
  name: string,
  slug: string,
}
const Procedures = ({ items, department }: { items: IItems[], department: IDepartment }) => {
  const router = useRouter();
  
  const removeQueryParam = (param: string) => {
    const { pathname, query } = router;
    const params = new URLSearchParams(Object.keys(query)[0]);
    params.delete(param);
    router.push({ pathname, query: params.toString() });
  };
  
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return <Layout>
    <Container>
      <Typography variant='h1'>Procedures</Typography>
      {department ?<Chip label={department.name} onDelete={() => removeQueryParam(department.slug)} /> : null}
      {items.length > 0 ? (
        <Grid container spacing={2}>
          {items.map((item: any, i: number) => {
            const href = `/procedure/${encodeURIComponent(item.slug)}`;
            return <Grid item key={i} xs={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="p">
                    {item.title}
                  </Typography>
                  <Typography variant="body2">
                    {item.summary}
                  </Typography>
                  {item.department ? (
                    <Link href={`/procedure?department=${item.department.slug.current}`}>{item.department.name}</Link>
                  ) : null}
                  <Person size={1} name={item.person.name} image={item.person.image} />
                  {item.tags ? <>
                    <Stack direction='row' spacing={1}>
                      {item.tags.map(({ title, slug }: { title: string, slug: string }, i: number) => (
                        <Chip key={`tag-${i}`} component="a" href={`/procedure?tags[]=${slug}`} clickable size="small" label={title} />
                      ))}
                    </Stack>
                  </> : null}
                </CardContent>
                <CardActions>
                  <Button href={href} variant="contained">Read More</Button>
                </CardActions>
              </Card>
            </Grid>
          })}
        </Grid>
      ) : 'Sorry, no matching items'}
    </Container>
  </Layout>
}

export async function getServerSideProps({ query }) {
  const itemsQuery = `*[
      _type == "procedure"
      && select(
        defined($department) => department->slug.current == $department,
        true
      )
    ] | order(publishedAt desc){
      title,
      summary,
      'department': department->{ name, slug },
      'slug': slug.current,
      'person': subjectMatterExpert->{
        'name': select(
          defined(preferred_name) => preferred_name,
          first_name
        ) + ' ' + last_name,
        'image': image.asset->url+'?h=80',
      },
      'tags': tags[]->{ title, slug }
    }
  `;
  const departmentQuery = `*[_type == 'department' && slug.current == $department][0] { name, 'slug': slug.current }`

  const response = await client.fetch(`
    {
      'items': ${itemsQuery},
      'department': ${departmentQuery},
    }
  `, { department: query.department || null });
  const { items } = response;
  const department = Object.keys(response.department).length > 0 ? response.department : null;
  return {
    props: { items, department }
  }
}

export default Procedures