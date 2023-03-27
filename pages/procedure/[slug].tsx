import { GetStaticProps } from 'next'
import { Chip, Container, Stack, Typography } from '@mui/material';
import { PortableText } from '@portabletext/react'
import Layout from '../../components/Layout'
import client from '../../client'
import { formatDate } from '../../utilities'
import Person from '../../components/Person'


interface IPerson {
  name: string,
  image: string,
}

interface IProcedure {
  _updatedAt: string,
  department: { name: string, slug: string },
  title: string,
  summary: string,
  executiveOwner: IPerson,
  subjectMatterExpert: IPerson,
  stakeHolders: IPerson[],
  effectiveDate: string,
  timeEstimate: number,
  conditions: any,
  notes?: string,
  steps: any,
  tags: any,
  frequency: any,

}

const Procedure = ({
  _updatedAt,
  department,
  title,
  summary,
  executiveOwner,
  subjectMatterExpert,
  stakeHolders,
  effectiveDate,
  timeEstimate,
  conditions,
  notes,
  steps,
  tags,
  frequency,
}: IProcedure) => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <article>
          <Typography variant="h1" color="primary">{title}</Typography>

          <Typography variant="h4" component="p">{summary}</Typography>
          
          <Stack direction='row' spacing={2}>
            <Typography variant="body2">Effective: {formatDate(effectiveDate)}</Typography>
            <Typography variant="body2">Updated: {formatDate(_updatedAt)}</Typography>
          </Stack>

          
          <Typography variant="h2">{department?.name}</Typography>
          
          {tags ? <>
            <Typography variant='overline' component='p'>Tags</Typography>
            <Stack direction='row' spacing={1}>
              {tags.map(({ title, slug }: { title: string, slug: string }, i: number) => (
                <Chip key={`tag-${i}`} component="a" href={`/procedure?tags[]=${slug}`} clickable label={title} />
              ))}
            </Stack>
          </> : null}

          {/* this is an array of refs */}
          {/* <div>{terms}</div> */}

          <Stack direction='row' spacing={5}>
            {executiveOwner ? <div>
              <Typography variant='overline'>Executive Owner</Typography>
              <Person name={executiveOwner?.name} image={executiveOwner?.image} />
            </div> : null}

            {subjectMatterExpert ? <div>
              <Typography variant='overline'>Subject Matter Expert</Typography>
              <Person name={subjectMatterExpert?.name} image={subjectMatterExpert?.image} />
            </div> : null}

            {stakeHolders ? <div>
              <Typography variant='overline'>Stakeholders</Typography>
              <Stack direction='row' spacing={2}>

                {stakeHolders?.map(({ name, image }: IPerson) => (
                  <Person name={name} image={image} key={`stake-holder-${name}`} />
                ))}
              </Stack>
            </div> : null}
          </Stack>
          
          
          {frequency ? <p>
            <Typography variant='overline'>Frequency</Typography>
            {frequency}
          </p> : null}

          <div>{timeEstimate}</div>
          
          {conditions ? <>
            <Typography variant='overline' component='p'>Conditions</Typography>
            <ul>{conditions.map((a: string) => <li key={a}>{a}</li>)}</ul>
          </> : null}
          
          <div>{notes}</div>

          <Typography variant="h2">Steps</Typography>
          <PortableText value={steps} />
          
        </article>
      </Container>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "procedure" && defined(slug.current)][].slug.current`
  )

  return {
    paths: paths.map((slug: string) => ({params: {slug}})),
    fallback: true,
  }
}

const getStaticProps: GetStaticProps = async (context) => {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug } = context?.params || { slug: '' };
  const personFields = `{
    preferred_name,
    'name': select(
      defined(preferred_name) => preferred_name,
      first_name
    ) + ' ' + last_name,
    'image': image.asset->url+'?h=80',
  }`;
  console.log(slug);
  const document = await client.fetch(`
    *[_type == "procedure" && slug.current == $slug][0] {
     ...,
     'department': department->{
      'slug': slug.current,
      name,
     },
     'stakeHolders': stakeHolders[]->${personFields},
     'executiveOwner': executiveOwner->${personFields},
     'subjectMatterExpert': subjectMatterExpert->${personFields},
     'tags': tags[]->{ title, slug },
     'resources': resources[]->{ title, slug },
    }
  `, { slug });
  return {
    props: document
  }
}

export { getStaticProps }
export default Procedure
