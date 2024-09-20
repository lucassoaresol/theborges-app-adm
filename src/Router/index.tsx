import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthLayout } from '@/view/layouts/AuthLayout';
import { RouteLayout } from '@/view/layouts/RouteLayout';
import { Booking } from '@/view/pages/Booking';
import { BookingAdm } from '@/view/pages/BookingAdm';
import { BookingDetail } from '@/view/pages/BookingDetail';
import { Home } from '@/view/pages/Home';
import { New } from '@/view/pages/New';
import { NewBooking } from '@/view/pages/NewBooking';
import { NewClient } from '@/view/pages/NewClient';
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
            <Route path="/booking/b/:id" element={<BookingAdm />} />
            <Route path="/booking/:id" element={<BookingDetail />} />
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
          <Route path="/agendar/c/:id" element={<NewClient />} />
          <Route path="/agendar/b/:id" element={<NewBooking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
