import React from 'react';
import LogoSvg from '@/icons/logo.svg';
import Link from 'next/link';

type Props = {
  onClick?: () => void;
};

export const Logo = ({ onClick }: Props) => {
  return (
    <>
      <Link href='/' onClick={onClick}>
        <LogoSvg className='text-neutral-800 dark:text-white' />
      </Link>
    </>
  );
};
