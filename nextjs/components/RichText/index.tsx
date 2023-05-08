import React, { useMemo } from 'react';

import serialize, { Children } from './serialize';

import classes from './index.module.scss'
import useNextjsLightbox from '../../features/lightbox/nextjsUseLightbox';
import { SlideImage } from 'yet-another-react-lightbox';

const useSlides = (content?: Children) => useMemo(() => {
  if (!content) return [];
  type Uploads = {
    alt?: string;
    url: string;
  }[];
  const rec = (content: Children, uploads: Uploads): void => {
    for (const item of content) {
      if (item.type === 'upload') {
        uploads.push({
          // TODO dedupe 1aa
          alt: item.value.alt,
          url: `${process.env.NEXT_PUBLIC_CMS_URL}${item.value.url}`
        });
      }
      if (item.children) rec(item.children, uploads);
    }
  }
  const uploads: Uploads = [];
  // not pretty but whatever, close your eyes
  rec(content, uploads);
  return uploads.map(({alt, url}) => ({
    alt,
    src: url,
    width: 640,
    height: 500,
  }));
}, [content]);

const RichText: React.FC<{ className?: string; content: Children }> = ({ className, content }) => {
  const { render: renderLightbox } = useNextjsLightbox();
  const slides = useSlides(content);
  if (!content) {
    return null
  }
  return (
    <div className={[classes.richText, className].filter(Boolean).join(' ')}>
      {renderLightbox({
        slides
      })}
      {serialize(content)}
    </div>
  )
}

export default RichText
