import Image from "next/image";
import {
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
} from "yet-another-react-lightbox/core";
import { Slide } from 'yet-another-react-lightbox/dist/types';
import { useMemo } from 'react';

export default function LightboxNextJsImage({ slide, rect, alt }: {
  rect: {width: number, height: number},
  slide: Slide,
  alt?: string,
}) {
  const { imageFit } = useLightboxProps().carousel;
  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

  const width = !cover
    ? Math.round(
      Math.min(rect.width, (rect.height / slide.height) * slide.width)
    )
    : rect.width;

  const height = !cover
    ? Math.round(
      Math.min(rect.height, (rect.width / slide.width) * slide.height)
    )
    : rect.height;
  const src = useMemo(() => ({width, height, ...slide}), [slide, width, height]);
  return (
    <div style={{ position: "relative", width, height }}>
      <Image
        fill
        alt={alt}
        src={src}
        loading="eager"
        // placeholder="blur"
        draggable={false}
        style={{ objectFit: cover ? "cover" : "contain" }}
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
      />
    </div>
  );
}
