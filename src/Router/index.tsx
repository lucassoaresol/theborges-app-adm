import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthLayout } from '@/view/layouts/AuthLayout';
import { RouteLayout } from '@/view/layouts/RouteLayout';
import { Booking } from '@/view/pages/Booking';
import { Home } from '@/view/pages/Home';
import { New } from '@/view/pages/New';
import { SignIn } from '@/view/pages/SignIn';
import { SignUp } from '@/view/pages/SignUp';

import { AuthGuard } from './AuthGuard';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard isPrivate />}>
          <Route element={<RouteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
          </Route>
        </Route>
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/agendar" element={<New />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
