import { useMediaQuery } from 'react-responsive';
import { Outlet } from 'react-router-dom';

import { Appbar } from '../components/Appbar';
import { Logo } from '../components/Logo';

export function RouteLayout() {
  const isDesktop = useMediaQuery({
    query: '(min-width: 1024px)',
  });

  return isDesktop ? (
    <div className="flex w-full">
      <div className="w-[25%]">
        <div className="bg-secondary h-16 pl-6">
          <Logo />
        </div>
      </div>
      <div className="w-[75%]">
        <Appbar isLogo={false} isMenu={false} />
        <Outlet />
      </div>
    </div>
  ) : (
    <div>
      <Appbar isLogo isMenu />
      <Outlet />
    </div>
  );
}
