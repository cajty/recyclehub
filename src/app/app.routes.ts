import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { ProfileViewComponent } from './features/profile/pages/profile-view/profile-view.component';
import {CollectionDetailComponent} from './features/collection/pages/collection-detail/collection-detail.component';
import {CollectionComponent} from './features/collection/pages/collection/collection.component';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'user',
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
    children: [
      {
        path: '',
        component: CollectionComponent
      },
      {
        path: ':id',
        component: CollectionDetailComponent

      }
    ],
        canActivate: [authGuard]
  },
  {
    path: 'profile',
        component: ProfileViewComponent,
        canActivate: [authGuard]
  }

];
