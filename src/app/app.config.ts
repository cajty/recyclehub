import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import {provideRouter} from '@angular/router';
import {ApplicationConfig} from '@angular/core';
import {routes} from './app.routes';
import {provideStore} from '@ngrx/store';
import {userReducer} from './store/user/user.reducer';
import {provideEffects} from '@ngrx/effects';
import {UserEffects} from './store/user/user.effects';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideStoreDevtools} from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ users: userReducer }),
    provideEffects([UserEffects]),
    provideAnimationsAsync(),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
};
