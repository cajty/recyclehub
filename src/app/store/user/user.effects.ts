import {inject, Injectable} from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as UserActions from './user.actions';
import { UserService } from '../../core/services/user.service';



@Injectable()
export class UserEffects {
 private actions$ = inject(Actions);
 private userService = inject(UserService);

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserById),
      switchMap(({ id }) =>
        this.userService.getUserById(id).pipe(
          map((user) => UserActions.loadUserByIdSuccess({ user })),
          catchError((error) => of(UserActions.loadUserByIdFailure({ error })))
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
   updateUserPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserPoints),
      mergeMap(({ id, points }) =>
        this.userService.updateUserPoints(id, points).pipe(
          map(updatedUser => UserActions.updateUserPointsSuccess({ user: updatedUser })),
          catchError(error => of(UserActions.updateUserPointsFailure({ error: error.message })))
        )
      )
    )
  );


  ConvertPointToBalance$ = createEffect(() =>
  this.actions$.pipe(
    ofType(UserActions.convertPointToBalance),
    mergeMap(({ userId ,point, balance}) =>
    this.userService.convertPointsToBalance(userId ,point, balance).pipe(
      map(updatedUser => UserActions.updateUserPointsSuccess({ user: updatedUser })),
      catchError(error => of(UserActions.updateUserPointsFailure({ error: error.message })))
    )
    )
  )
  );






}
