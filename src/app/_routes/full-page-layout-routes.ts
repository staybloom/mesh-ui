import { Routes } from '@angular/router';
import { FullPageLayoutComponent } from '../_layouts/full-page-layout/full-page-layout/full-page-layout.component';
export const FULL_PAGE_LAYOUT_ROUTES: Routes = [
  // Keeping a default Page till we add a unit level page
  {
    path: '',
    component: FullPageLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../_pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
    ],
  },
];
