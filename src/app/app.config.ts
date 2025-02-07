import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { userReducer } from './store/user/user.reducer';
import { UserEffects } from './store/user/user.effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideStoreDevtools, StoreDevtoolsModule} from '@ngrx/store-devtools';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ users: userReducer }),
    provideEffects([UserEffects]),
    provideAnimationsAsync(),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
};
