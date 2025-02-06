import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('users');

export const selectAllUsers = createSelector(
  selectUserState,
  (state: UserState) => state.users
);

export const selectCollectors = createSelector(
  selectUserState,
  (state: UserState) => state.collectors
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);

export const selectIsAuthenticated = createSelector(
  selectUserState,
  (state: UserState) => state.users.length > 0
);

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.users[0]
);

export const selectUserPoints = createSelector(
  selectUser,
  (user) => user?.points || 0
);
