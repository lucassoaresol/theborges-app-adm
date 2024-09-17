import { Outlet } from 'react-router-dom';

import { Appbar } from '../components/Appbar';

export function AuthLayout() {
  return (
    <div>
      <Appbar isLogo isMenu={false} />
      <Outlet />
    </div>
  );
}
