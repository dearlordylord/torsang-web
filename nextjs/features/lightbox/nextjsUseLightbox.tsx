import * as React from 'react'
import dynamic from 'next/dynamic'
import type { LightboxExternalProps } from 'yet-another-react-lightbox'
import { useLightbox } from './provider'
import LightboxNextJsImage from './lightboxNextjsImage'
import { useCallback, useMemo } from 'react'
import { Slide } from 'yet-another-react-lightbox/dist/types'

const Lightbox = dynamic(() => import('./nextjsWrapper'))

export default function useNextjsLightbox() {
  const { isOpen, open, close, lastInvokedImageSrc } = useLightbox()
  // const [interactive, setInteractive] = React.useState(false);
  const getIndex = useCallback(
    (slides: Slide[]) => {
      const index = slides.findIndex(s => s.src === lastInvokedImageSrc)
      if (lastInvokedImageSrc && index === -1) {
        console.error('lastInvokedImageSrc not found in slides', lastInvokedImageSrc, slides)
      }
      return index === -1 ? 0 : index
    },
    [lastInvokedImageSrc],
  )
  const render = React.useCallback(
    (props?: Omit<LightboxExternalProps, 'open' | 'close'>) =>
      isOpen ? (
        <Lightbox
          open={isOpen}
          close={close}
          index={getIndex(props.slides)}
          render={{
            slide: LightboxNextJsImage,
          }}
          {...props}
          carousel={{
            ...(props.carousel ? props.carousel : {}),
            finite:
              typeof props.carousel?.finite === 'undefined'
                ? props.slides.length < 3
                : props.carousel.finite,
          }}
        />
      ) : null,
    [open, close, isOpen, lastInvokedImageSrc],
  )

  return { open, close, isOpen, render }
}
