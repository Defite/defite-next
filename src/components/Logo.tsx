import React from 'react';
import LogoSvg from '@/icons/logo.svg';
import Link from 'next/link';

type Props = {
  onClick?: () => void;
};

export const Logo = ({ onClick }: Props) => {
  return (
    <>
      <Link href='/' aria-label='D.' onClick={onClick}>
        <LogoSvg className='text-neutral-700 dark:text-neutral-300' />
      </Link>
    </>
  );
};
