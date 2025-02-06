import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import {User} from '../../models/user.model';

export interface UserState {
  users: User[];
  collectors: User[];
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  users: [],
  collectors: [],
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(UserActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    error: null
  })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    error: null
  })),
  on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter(user => user.id !== id),
    error: null
  })),
  on(UserActions.getCollectorsByCitySuccess, (state, { collectors }) => ({
    ...state,
    collectors,
    error: null
  }))
);
