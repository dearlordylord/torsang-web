import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import logo from '../../public/tf-logo.png'

import classes from './index.module.scss'

export const Footer = () => {
  return (
    <footer className={classes.footer}>
      <Link href="/">
        <Image
          className={classes.footerPicture}
          src={logo.src}
          alt="Logo"
          width={150}
          height={150}
        />
      </Link>
      <div className={classes.footerInner}>
        <div className={classes.footerContent}>
          <p className={classes.footerCopyright}>
            <span>Torsang © 2023</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
