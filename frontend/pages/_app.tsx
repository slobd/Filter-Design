import type { AppProps } from 'next/app'
import { ContextWrapper } from '../context/context';
import Head from "next/head";

import './../i18n';

import '../styles/globals.css';
import '../styles/styles.css';

function MyApp({ Component, pageProps } : AppProps) {
  return (
    <ContextWrapper>
      <Head>          
          <meta charSet='utf-8'/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />      
    </ContextWrapper>
  )
}

export default MyApp