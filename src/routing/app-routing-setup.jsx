import React, { Suspense } from 'react';

import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { Demo1Layout } from '@/layouts/demo1/layout';
import { ContentLoader } from '@/components/common/content-loader';

const DefaultPage = React.lazy(() => import('@/pages/dashboards').then(module => ({ default: module.DefaultPage })));

const Home = React.lazy(() => import('@/pages/Home'));

import { Navigate, Route, Routes } from 'react-router';

export function AppRoutingSetup() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route path="/" element={
          <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
            <Home />
          </Suspense>
        } />

        {/* wrap different products in their own layouts */}
        <Route element={<Demo1Layout />}>
          <Route path="/home" element={
            <Suspense fallback={<ContentLoader className="h-[calc(100vh-64px)]" />}>
              <DefaultPage />
            </Suspense>
          } />
        </Route>
      </Route>

      <Route path="error/*" element={<ErrorRouting />} />
      <Route path="auth/*" element={<AuthRouting />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
}
