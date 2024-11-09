import React from 'react';
import Image, { ImageProps } from 'next/image';
import style from './style.module.css';

type Props = ImageProps & {
  caption?: string;
};

export function MdxImage(props: Props) {
  const { caption, alt } = props;
  return (
    <figure className={style.figure}>
      <Image {...props} alt={alt || caption || 'There was an image here'} />
      {caption ? (
        <figcaption className={style.figcaption}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
