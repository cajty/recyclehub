import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';


export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: any }>()
);


export const loadUserById = createAction(
  '[User] Load User By ID',
  props<{ id: string }>()
);
export const loadUserByIdSuccess = createAction(
  '[User] Load User By ID Success',
  props<{ user: User }>()
);
export const loadUserByIdFailure = createAction(
  '[User] Load User By ID Failure',
  props<{ error: any }>()
);


export const loadUserByEmail = createAction(
  '[User] Load User By Email',
  props<{ email: string }>()
);
export const loadUserByEmailSuccess = createAction(
  '[User] Load User By Email Success',
  props<{ users: User[] }>()
);
export const loadUserByEmailFailure = createAction(
  '[User] Load User By Email Failure',
  props<{ error: any }>()
);


export const createUser = createAction(
  '[User] Create User',
  props<{ user: User }>()
);
export const createUserSuccess = createAction(
  '[User] Create User Success',
  props<{ user: User }>()
);
export const createUserFailure = createAction(
  '[User] Create User Failure',
  props<{ error: any }>()
);


export const updateUser = createAction(
  '[User] Update User',
  props<{ id: string, user: Partial<User> }>()
);
export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: User }>()
);
export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: any }>()
);


// Delete User
export const deleteUser = createAction(
  '[User] Delete User',
  props<{ id: string }>()
);
export const deleteUserSuccess = createAction(
  '[User] Delete User Success',
  props<{ id: string }>()
);
export const deleteUserFailure = createAction(
  '[User] Delete User Failure',
  props<{ error: any }>()
);


export const updateUserPoints = createAction(
  '[User] Update User Points',
  props<{ id: string, points: number }>()
);
export const updateUserPointsSuccess = createAction(
  '[User] Update User Points Success',
  props<{ user: User }>()
);
export const updateUserPointsFailure = createAction(
  '[User] Update User Points Failure',
  props<{ error: any }>()
);


export const getCollectorsByCity = createAction(
  '[User] Get Collectors By City',
  props<{ city: string }>()
);
export const getCollectorsByCitySuccess = createAction(
  '[User] Get Collectors By City Success',
  props<{ users: User[] }>()
);
export const getCollectorsByCityFailure = createAction(
  '[User] Get Collectors By City Failure',
  props<{ error: any }>()
);
