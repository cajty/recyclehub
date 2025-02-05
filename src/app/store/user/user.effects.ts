import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as UserActions from './user.actions';
import { UserService } from '../../core/services/user.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.userService.getAllUsers().pipe(
          map(users => UserActions.loadUsersSuccess({ users })),
          catchError(error => of(UserActions.loadUsersFailure({ error })))
        )
      )
    )
  );

  loadUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserById),
      mergeMap(action =>
        this.userService.getUserById(action.id).pipe(
          map(user => UserActions.loadUserByIdSuccess({ user })),
          catchError(error => of(UserActions.loadUserByIdFailure({ error })))
        )
      )
    )
  );

  loadUserByEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserByEmail),
      mergeMap(action =>
        this.userService.getUserByEmail(action.email).pipe(
          map(users => UserActions.loadUserByEmailSuccess({ users })),
          catchError(error => of(UserActions.loadUserByEmailFailure({ error })))
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      mergeMap(action =>
        this.userService.createUser(action.user).pipe(
          map(user => UserActions.createUserSuccess({ user })),
          catchError(error => of(UserActions.createUserFailure({ error })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(action =>
        this.userService.updateUser(action.id, action.user).pipe(
          map(user => UserActions.updateUserSuccess({ user })),
          catchError(error => of(UserActions.updateUserFailure({ error })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap(action =>
        this.userService.deleteUser(action.id).pipe(
          map(() => UserActions.deleteUserSuccess()),
          catchError(error => of(UserActions.deleteUserFailure({ error })))
        )
      )
    )
  );

  updateUserPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserPoints),
      mergeMap(action =>
        this.userService.updateUserPoints(action.id, action.points).pipe(
          map(user => UserActions.updateUserPointsSuccess({ user })),
          catchError(error => of(UserActions.updateUserPointsFailure({ error })))
        )
      )
    )
  );

  getCollectorsByCity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getCollectorsByCity),
      mergeMap(action =>
        this.userService.getCollectorsByCity(action.city).pipe(
          map(users => UserActions.getCollectorsByCitySuccess({ users })),
          catchError(error => of(UserActions.getCollectorsByCityFailure({ error })))
        )
      )
    )
  );
}
