import { useState, useCallback } from 'react'
import { NextRouter, useRouter } from 'next/router'

interface LanguageSwitcher<Langs extends string[] = string[]> {
  current: Langs[number]
  all: Langs
  set: (language: Langs[number]) => Promise<void>
  loading: boolean
}

export const getLocaleOrDefault = (router: NextRouter): string | undefined =>
  router.locale || router.defaultLocale || router.locales[0]

export const useLocaleOrDefault = () => getLocaleOrDefault(useRouter())

export const useLanguageSwitcher = <
  Langs extends string[] = string[],
>(): LanguageSwitcher<Langs> => {
  const router = useRouter()
  // no need to clear on unmount also; it'll drop to 0 then
  const [calls, setCalls] = useState(0)
  const { locales, pathname, asPath } = router
  const localeOrDefault = useLocaleOrDefault()

  const [loading, setLoading] = useState(false)

  const set = useCallback(
    async (language: Langs[number]): Promise<void> => {
      if (!locales.includes(language)) {
        console.warn(`Language "${language}" is not available in this app`)
        return
      }
      setLoading(true)
      setCalls(calls + 1)

      // TODO cancel previous navigation, if any is going on; ref https://github.com/vercel/next.js/discussions/32231
      router.push(pathname, asPath, { locale: language }).finally(() => {
        if (calls <= 1) setLoading(false)
        setCalls(calls - 1)
      })
    },
    [locales, router, pathname, asPath, calls],
  )

  return { current: localeOrDefault, all: (locales || []) as Langs, set, loading }
}
