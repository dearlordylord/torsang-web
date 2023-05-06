import React, { useState } from 'react'
import Link from 'next/link'
import { PayloadAdminBarProps, PayloadMeUser } from 'payload-admin-bar'

import { LanguageSwitcher } from '../../features/language/switcher/component'
import { MainMenu } from '../../payload-types'
import { CMSLink } from '../CMSLink'
import { Gutter } from '../Gutter'
import { Logo } from '../Logo'
import { AdminBar } from './AdminBar'

import classes from './index.module.scss'

type HeaderBarProps = {
  children?: React.ReactNode
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ children }) => {
  return (
    <div className={classes.header}>
      <Gutter className={classes.wrap}>
        <Link href="/">
          <Logo />
        </Link>
        <div className={classes.languageAndNavWrap}>
          {children}
          <div className={classes.languageSelectorWrap}>
            <LanguageSwitcher />
          </div>
        </div>
      </Gutter>
    </div>
  )
}

export const Header: React.FC<{
  globals: {
    mainMenu: MainMenu
  }
  adminBarProps: PayloadAdminBarProps
}> = props => {
  const { globals, adminBarProps } = props

  const [user, setUser] = useState<PayloadMeUser>()

  const {
    mainMenu: { navItems },
  } = globals

  const hasNavItems = navItems && Array.isArray(navItems) && navItems.length > 0

  return (
    <header className={classes.header}>
      <AdminBar adminBarProps={adminBarProps} user={user} setUser={setUser} />
      <HeaderBar>
        {hasNavItems && (
          <nav className={classes.nav}>
            {navItems.map(({ link }, i) => (
              <CMSLink key={i} {...link} className={classes.headerLinkAnchor} />
            ))}
          </nav>
        )}
      </HeaderBar>
    </header>
  )
}
