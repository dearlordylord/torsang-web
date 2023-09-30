import React from 'react'
import { cx } from 'emotion'
import Image from 'next/image'

import logo from '../../public/tf-logo-05.png'

import classes from './index.module.scss'

const CSS_LOGO_CSS_PROPERTY_NAME = '--css-logo-size-px' as const

const assertExists = <T,>(value: T | null | undefined): T => {
  if (value === null || value === undefined) {
    throw new Error('Expected value to exist')
  }
  return value
}

const getCssLogoSize = () =>
  typeof window !== 'undefined'
    ? parseInt(
        assertExists(
          window
            .getComputedStyle(assertExists(document.querySelector(':root') as HTMLBaseElement))
            .getPropertyValue(CSS_LOGO_CSS_PROPERTY_NAME),
        ),
        10,
      )
    : 60 /*ssr; TODO we could also validate against css value*/

export const Logo = ({ className }: { className?: string }) => {
  const cssLogoSize = getCssLogoSize()
  return (
    <Image
      className={cx(className, classes.logo)}
      src={logo.src}
      alt="Logo"
      width={cssLogoSize}
      height={cssLogoSize}
    />
  )
}
