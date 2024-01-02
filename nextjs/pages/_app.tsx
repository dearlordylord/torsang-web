import React, { useCallback } from 'react'
import { CookiesProvider } from 'react-cookie'
import App, { AppContext, AppProps as NextAppProps } from 'next/app'
import Head from 'next/head'
import { NextRouter, useRouter } from 'next/router'
import Script from 'next/script'

import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { getLocaleOrDefault } from '../features/language/switcher/hook'
import { MainMenu, Meta } from '../payload-types'

import '../css/app.scss'

import styles from './index.module.scss'

export interface IGlobals {
  mainMenu: MainMenu
  meta: Meta
}

export const getAllGlobals = async (router: NextRouter): Promise<IGlobals> => {
  const locale = getLocaleOrDefault(router)
  const mmres = fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/globals/main-menu?depth=1&locale=${locale}`,
  )
  const mres = fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/globals/meta?depth=1&locale=${locale}`)
  const [mainMenu, meta] = await Promise.all([mmres, mres]).then(async ([mmres, mres]) => [
    await mmres.json(),
    await mres.json(),
  ])
  return {
    mainMenu,
    meta,
  }
}

type AppProps<P = any> = {
  pageProps: P
} & Omit<NextAppProps<P>, 'pageProps'>

const Metas = ({ globals }: { globals: IGlobals }) => {
  const { meta } = globals
  const title = meta.title || 'Torsang'
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} key="title" />
    </Head>
  )
}

const PayloadApp = (
  appProps: AppProps & {
    globals: IGlobals
  },
): React.ReactElement => {
  const { Component, pageProps, globals } = appProps

  const { collection, id, preview } = pageProps

  const router = useRouter()

  const onPreviewExit = useCallback(() => {
    const exit = async () => {
      const exitReq = await fetch('/api/exit-preview')
      if (exitReq.status === 200) {
        router.reload()
      }
    }
    exit()
  }, [router])

  return (
    <CookiesProvider>
      <>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-V6VZ2D1FER"
        />
        <Script id="analytics-script" strategy="afterInteractive">
          {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-V6VZ2D1FER');
          `}
        </Script>
      </>
      <Metas globals={globals} />
      <div className={styles.wrapper}>
        <Header
          globals={globals}
          adminBarProps={{
            collection,
            id,
            preview,
            onPreviewExit,
          }}
        />
        <main className={styles.main}>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </CookiesProvider>
  )
}

PayloadApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)

  const globals = await getAllGlobals(appContext.router)

  return {
    ...appProps,
    globals,
  }
}

export default PayloadApp
