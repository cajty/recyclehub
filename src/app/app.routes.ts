import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { CollectionListComponent } from './features/collection/pages/collection-list/collection-list.component';
import { CollectionRequestComponent } from './features/collection/pages/collection-request/collection-request.component';
import { CollectionDetailComponent } from './features/collection/pages/collection-detail/collection-detail.component';
import { ProfileViewComponent } from './features/profile/pages/profile-view/profile-view.component';
import { ProfileEditComponent } from './features/profile/pages/profile-edit/profile-edit.component';
import { PointsSummaryComponent } from './features/points/pages/points-summary/points-summary.component';
import { PointsConversionComponent } from './features/points/pages/points-conversion/points-conversion.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },
  {
    path: 'collection',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: CollectionListComponent
      },
      {
        path: 'request',
        canActivate: [authGuard],
        component: CollectionRequestComponent
      },
      {
        path: ':id',
        component: CollectionDetailComponent
      }
    ]
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: ProfileViewComponent
      },
      {
        path: 'edit',
        component: ProfileEditComponent
      }
    ]
  },
  {
    path: 'points',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: PointsSummaryComponent
      },
      {
        path: 'convert',
        component: PointsConversionComponent
      }
    ]
  }
];
