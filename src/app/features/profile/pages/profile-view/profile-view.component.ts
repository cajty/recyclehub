import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { User } from '../../../../models/user.model';
import * as UserActions from '../../../../store/user/user.actions';
import * as UserSelectors from '../../../../store/user/user.selectors';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  user$: Observable<User | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  userPoints$: Observable<number>;

  constructor(private store: Store) {
    this.user$ = this.store.select(UserSelectors.selectUser);
    this.loading$ = this.store.select(UserSelectors.selectUserLoading);
    this.error$ = this.store.select(UserSelectors.selectUserError);
    this.userPoints$ = this.store.select(UserSelectors.selectUserPoints);
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.store.dispatch(UserActions.loadUserById({ id: userId }));
    } else {
      this.store.dispatch(UserActions.loadUsers());
    }
  }

  updateUser(userId: string, userData: Partial<User>): void {
    this.store.dispatch(UserActions.updateUser({ id: userId, user: userData }));
  }

  deleteAccount(userId: string): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.store.dispatch(UserActions.deleteUser({ id: userId }));
    }
  }

  convertPoints(userId: string, pointsToRedeem: number): void {
    this.store.dispatch(UserActions.updateUserPoints({
      id: userId,
      points: pointsToRedeem
    }));
  }
}
