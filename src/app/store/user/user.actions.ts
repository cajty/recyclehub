import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

// Load Users
export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: string }>()
);

// Load User By id
export const loadUserById = createAction(
  '[User] Load User By Id',
  props<{id : string }>()
);
export const loadUserByIdSuccess = createAction(
  '[User] Load User By Id Success',
  props<{ user: User }>()
);
export const loadUserByIdFailure = createAction(
  '[User] Load User By Id Failure',
  props<{ error: string }>()
);



// Update User
export const updateUser = createAction(
  '[User] Update User',
  props<{ id: string; user: Partial<User> }>()
);
export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: User }>()
);
export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: string }>()
);

// Update User Points
export const updateUserPoints = createAction(
  '[User] Update User Points',
  props<{ id: string; points: number }>()
);
export const updateUserPointsSuccess = createAction(
  '[User] Update User Points Success',
  props<{ user: User }>()
);
export const updateUserPointsFailure = createAction(
  '[User] Update User Points Failure',
  props<{ error: string }>()
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
  props<{ error: string }>()
);

// Get Collectors By City
export const getCollectorsByCity = createAction(
  '[User] Get Collectors By City',
  props<{ city: string }>()
);
export const getCollectorsByCitySuccess = createAction(
  '[User] Get Collectors By City Success',
  props<{ collectors: User[] }>()
);
export const getCollectorsByCityFailure = createAction(
  '[User] Get Collectors By City Failure',
  props<{ error: string }>()
);
