import { useLanguageSwitcher } from './hook'
import React from 'react'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { useRouter } from 'next/router'

import styles from './component.module.scss'
import { cx } from 'emotion'

const eqSet = <T,>(xs: Set<T>, ys: Set<T>) => xs.size === ys.size && [...xs].every(x => ys.has(x))

const flags = {
  en: getUnicodeFlagIcon('GB'),
  th: getUnicodeFlagIcon('TH'),
} as const

const useGetFlagChar = () => {
  const router = useRouter()
  const locales = router.locales
  if (!eqSet(new Set(locales), new Set(Object.keys(flags)))) {
    console.error('Language flags are not defined for all locales')
  }
  return (language: string) => flags[language] || getUnicodeFlagIcon(language.toUpperCase())
}

export const LanguageSwitcher = () => {
  const { all, set, current, loading } = useLanguageSwitcher()
  const handleLanguageChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value
    await set(language)
  }

  const getFlagChar = useGetFlagChar()

  const flags = all.map(getFlagChar)

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
          {flags[i]}
        </a>
      ))}
    </div>
  )
}
