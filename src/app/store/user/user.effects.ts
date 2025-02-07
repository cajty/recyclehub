import {inject, Injectable} from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import * as UserActions from './user.actions';
import { UserService } from '../../core/services/user.service';
import {loadUserByEmail} from './user.actions';

@Injectable()
export class UserEffects {
 private actions$ = inject(Actions);
 private userService = inject(UserService);

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserByEmail),
      switchMap(({ email }) =>
        this.userService.getUserByEmail(email).pipe(
          map((user) => UserActions.loadUserByEmailSuccess({ user })),
          catchError((error) => of(UserActions.loadUserByEmailFailure({ error })))
        )
      )
    )
  );



  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ id, user }) =>
        this.userService.updateUser(id, user).pipe(
          map(updatedUser => UserActions.updateUserSuccess({ user: updatedUser })),
          catchError(error => of(UserActions.updateUserFailure({ error: error.message })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap(({ id }) =>
        this.userService.deleteUser(id).pipe(
          map(() => UserActions.deleteUserSuccess({ id })),
          catchError(error => of(UserActions.deleteUserFailure({ error: error.message })))
        )
      )
    )
  );

  getCollectorsByCity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getCollectorsByCity),
      mergeMap(({ city }) =>
        this.userService.getCollectorsByCity(city).pipe(
          map(collectors => UserActions.getCollectorsByCitySuccess({ collectors })),
          catchError(error => of(UserActions.getCollectorsByCityFailure({ error: error.message })))
        )
      )
    )
  );
}
