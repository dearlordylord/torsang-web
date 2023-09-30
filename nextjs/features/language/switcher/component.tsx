import { useLanguageSwitcher } from './hook'
import React from 'react'
import { GB, TH } from 'country-flag-icons/react/3x2'
import { useRouter } from 'next/router'

import styles from './component.module.scss'
import { cx } from '@emotion/css'

const eqSet = <T,>(xs: Set<T>, ys: Set<T>) => xs.size === ys.size && [...xs].every(x => ys.has(x))

const flagComponents = [
  <GB className={styles.languageFlag} />,
  <TH className={styles.languageFlag} />,
]

export const LanguageSwitcher = () => {
  const { all, set, current, loading } = useLanguageSwitcher()
  const handleLanguageChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value
    await set(language)
  }

  return (
    <div>
      {all.map((language, i) => (
        <a
          href="#"
          className={cx(styles.languageFlag, {
            [styles.languageFlagCurrent]: !loading && current === language,
            [styles.languageFlagNotCurrent]: !loading && current !== language,
            [styles.languageFlagLoading]: loading,
          })}
          key={language}
          onClick={() => set(language)}
        >
          {flagComponents[i]}
        </a>
      ))}
    </div>
  )
}
