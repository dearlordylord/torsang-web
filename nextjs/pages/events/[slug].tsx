import React from 'react'
import { GetStaticPaths } from 'next'

import { Gutter } from '../../components/Gutter'
import RichText from '../../components/RichText'
import { Children } from '../../components/RichText/serialize'
import { LightboxContextProvider } from '../../features/lightbox/provider'
import { makeGetStaticPaths, makeGetStaticProps } from '../../features/staticProps/utils'
import type { Event, MainMenu } from '../../payload-types'

import classes from '../index.module.scss'

const CMS_COLLECTION_SLUG = 'events' as const

const Event: React.FC<
  Event & {
    mainMenu: MainMenu
    preview?: boolean
  }
> = props => {
  const { title, richText, slug } = props
  return (
    <Gutter>
      {slug === 'home' ? null : <h1 className={classes.hero}>{title}</h1>}
      <LightboxContextProvider>
        <RichText content={richText as Children} />
      </LightboxContextProvider>
    </Gutter>
  )
}

export default Event

export const getStaticProps = makeGetStaticProps(CMS_COLLECTION_SLUG)

export const getStaticPaths = makeGetStaticPaths(CMS_COLLECTION_SLUG)
