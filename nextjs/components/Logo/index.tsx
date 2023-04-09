import Image from 'next/image'
import React from 'react'
import logo from '../../public/tf-logo-05.png'

export const Logo: React.FC = () => {
  return (
    <Image src={logo.src} alt="Logo" width={60} height={60} />
  )
}
