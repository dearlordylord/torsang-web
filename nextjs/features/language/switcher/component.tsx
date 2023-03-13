import { useLanguageSwitcher } from './hook'
import React from 'react'

export const LanguageSwitcher = () => {
  const { all, set, current, loading } = useLanguageSwitcher()
  const handleLanguageChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value
    await set(language)
  }

  return (
    <div>
      <div>
        <select disabled={loading} value={current} onChange={handleLanguageChange}>
          {all.map(language => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
