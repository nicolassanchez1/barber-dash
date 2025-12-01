import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

const UtilsProducts = Loadable(lazy(() => import('views/utilities/Products')));
const UtilsCategories = Loadable(lazy(() => import('views/utilities/Categories')));
const UtilsUsers = Loadable(lazy(() => import('views/utilities/Users')));
const UtilsSketch = Loadable(lazy(() => import('views/utilities/SketchBar')));

const SamplePage = Loadable(lazy(() => import('views/sample-page')));

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),

  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardDefault />
        </ProtectedRoute>
      )
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: (
            <ProtectedRoute>
              <DashboardDefault />
            </ProtectedRoute>
          )
        }
      ]
    },
    {
      path: 'productos',
      element: (
        <ProtectedRoute>
          <UtilsProducts />
        </ProtectedRoute>
      )
    },
    {
      path: 'categories',
      element: (
        <ProtectedRoute>
          <UtilsCategories />
        </ProtectedRoute>
      )
    },
    {
      path: 'users',
      element: (
        <ProtectedRoute>
          <UtilsUsers />
        </ProtectedRoute>
      )
    },
    {
      path: 'sketch',
      element: (
        <ProtectedRoute>
          <UtilsSketch />
        </ProtectedRoute>
      )
    },
    {
      path: '/sample-page',
      element: (
        <ProtectedRoute>
          <SamplePage />
        </ProtectedRoute>
      )
    }
  ]
};

export default MainRoutes;
