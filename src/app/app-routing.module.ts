import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FULL_PAGE_LAYOUT_ROUTES } from './_routes/full-page-layout-routes';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '',
    children: FULL_PAGE_LAYOUT_ROUTES,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
