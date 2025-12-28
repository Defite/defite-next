import React from 'react';
import Image, { ImageProps } from 'next/image';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import style from './style.module.css';

type Props = ImageProps & {
  caption?: string;
};

export function MdxImage(props: Props) {
  const { caption, alt } = props;
  return (
    <figure className={style.figure}>
      <Zoom>
        <Image className="rounded-md" {...props} alt={alt || caption || 'There was an image here'} />
      </Zoom>
      {caption ? (
        <figcaption className={style.figcaption}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
