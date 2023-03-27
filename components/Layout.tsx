import Head from 'next/head'
import Header from './Header'

export default function Home({ title, description, children }: { title?: string, description?: string, children: JSX.Element }) {
  return (
    <>
      <Head>
        <title>{title || 'stuff-n-things'}</title>
        <meta name="description" content={description || 'bloopadoop'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        {children}
      </main>
    </>
  )
}
