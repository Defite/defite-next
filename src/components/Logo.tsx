import LogoNewYearSvg from '@/icons/new-year-logo.svg';
import Link from 'next/link';

type Props = {
  onClick?: () => void;
};

export const Logo = ({ onClick }: Props) => {
  return (
    <>
      <Link href='/' aria-label='D.' onClick={onClick}>
        <LogoNewYearSvg className='text-neutral-700 dark:text-neutral-300' />
      </Link>
    </>
  );
};
