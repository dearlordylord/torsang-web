import React, { FC, Fragment, useCallback } from 'react'
import escapeHTML from 'escape-html'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Text } from 'slate'
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

import useNextjsLightbox from '../../features/lightbox/nextjsUseLightbox'
import { LocationMap } from '../Map'

// eslint-disable-next-line no-use-before-define
export type Children = Leaf[]

type Leaf = {
  type: string
  value?: {
    url: string
    alt: string
  }
  children?: Children
  url?: string
  [key: string]: unknown
}

const SPECIAL_TAGS = {
  '{{map}}': LocationMap,
} as const

const ImageC = (props: React.ComponentProps<typeof Image>) => {
  const { open } = useNextjsLightbox()
  const onClick_ = props.onClick
  const src_ = props.src
  const onClick = useCallback(
    (e: Parameters<React.ComponentProps<typeof Image>['onClick']>[0]) => {
      if (onClick_) onClick_(e)
      open(typeof src_ === 'string' ? src_ : 'src TODO')
    },
    [open, onClick_, src_],
  )
  return <Image {...props} onClick={onClick} />
}

const serialize = (children: Children): React.ReactElement[] =>
  children.map((node, i) => {
    if (Text.isText(node)) {
      const Element = SPECIAL_TAGS[node.text as keyof typeof SPECIAL_TAGS]

      if (Element) return <Element />

      let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />

      if (node.bold) {
        text = <strong key={i}>{text}</strong>
      }

      if (node.code) {
        text = <code key={i}>{text}</code>
      }

      if (node.italic) {
        text = <em key={i}>{text}</em>
      }

      if (node.underline) {
        text = (
          <span style={{ textDecoration: 'underline' }} key={i}>
            {text}
          </span>
        )
      }

      if (node.strikethrough) {
        text = (
          <span style={{ textDecoration: 'line-through' }} key={i}>
            {text}
          </span>
        )
      }

      return <Fragment key={i}>{text}</Fragment>
    }

    if (!node) {
      return null
    }

    switch (node.type) {
      case 'h1':
        return <h1 key={i}>{serialize(node.children)}</h1>
      case 'h2':
        return <h2 key={i}>{serialize(node.children)}</h2>
      case 'h3':
        return <h3 key={i}>{serialize(node.children)}</h3>
      case 'h4':
        return <h4 key={i}>{serialize(node.children)}</h4>
      case 'h5':
        return <h5 key={i}>{serialize(node.children)}</h5>
      case 'h6':
        return <h6 key={i}>{serialize(node.children)}</h6>
      case 'quote':
        return <blockquote key={i}>{serialize(node.children)}</blockquote>
      case 'ul':
        return <ul key={i}>{serialize(node.children)}</ul>
      case 'ol':
        return <ol key={i}>{serialize(node.children)}</ol>
      case 'li':
        return <li key={i}>{serialize(node.children)}</li>
      case 'link':
        const isYoutube = node.url?.includes('youtube.com') || node.url?.includes('youtu.be')
        if (isYoutube) {
          return <ReactPlayer url={escapeHTML(node.url)} />
        }
        return (
          <a href={escapeHTML(node.url)} key={i}>
            {serialize(node.children)}
          </a>
        )
      case 'upload':
        return (
          <>
            {/*TODO dedupe 1aa*/}
            <ImageC
              width={200}
              height={200}
              alt={node.value.alt}
              src={process.env.NEXT_PUBLIC_CMS_URL + node.value.url}
            />
            {serialize(node.children)}
          </>
        )
      default:
        return <p key={i}>{serialize(node.children)}</p>
    }
  })

export default serialize
