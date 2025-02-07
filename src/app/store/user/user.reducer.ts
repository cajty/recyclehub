import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { User } from '../../models/user.model';


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
  // Load Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null
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

  // Load User By Email
  on(UserActions.loadUserById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.loadUserByIdSuccess, (state, { user }) => ({
    ...state,
    users: [user], // Replace with single user since we're loading by ID
    loading: false,
    error: null
  })),
  on(UserActions.loadUserByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),




  // Update User
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    loading: false,
    error: null
  })),
  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update User Points
  on(UserActions.updateUserPoints, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.updateUserPointsSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    loading: false,
    error: null
  })),
  on(UserActions.updateUserPointsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete User
  on(UserActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter(user => user.id !== id),
    loading: false,
    error: null
  })),
  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Get Collectors By City
  on(UserActions.getCollectorsByCity, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.getCollectorsByCitySuccess, (state, { collectors }) => ({
    ...state,
    collectors,
    loading: false,
    error: null
  })),
  on(UserActions.getCollectorsByCityFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
