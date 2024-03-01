import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Auth0Provider } from "@auth0/auth0-react";
import { ContextWrapper } from '../context/context';
import Head from "next/head";

import './../i18n';
import '../styles/globals.css';
import '../styles/styles.css';

function MyApp({ Component, pageProps } : AppProps) {
  const router = useRouter();
  const onRedirectCallback = (appState: any) => {
    router.push(appState?.returnTo || window.location.pathname);
  };
  return (
    <ContextWrapper>
      <Head>          
          <meta charSet='utf-8'/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <Auth0Provider
          domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? ""}
          clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? ""}
          authorizationParams={{
            redirect_uri: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL ?? "",
          }}
          onRedirectCallback={onRedirectCallback}
        >
          <Component {...pageProps} /> 
        </Auth0Provider>
    </ContextWrapper>
  )
}

export default MyApp