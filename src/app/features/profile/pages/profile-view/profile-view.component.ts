import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, NgIf, CommonModule } from '@angular/common';
import { User } from '../../../../models/user.model';
import * as UserActions from '../../../../store/user/user.actions';
import * as UserSelectors from '../../../../store/user/user.selectors';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe, CommonModule],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  user$: Observable<User | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.user$ = this.store.select(UserSelectors.selectUser);
    this.loading$ = this.store.select(UserSelectors.selectUserLoading);
    this.error$ = this.store.select(UserSelectors.selectUserError);
  }

  ngOnInit(): void {

        this.store.dispatch(UserActions.loadUserById({ id: '2' }));

  // Log the user state changes
  this.user$.subscribe(user => {
    console.log('Current user state:', user);
  });
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
    if (pointsToRedeem === 100 || pointsToRedeem === 200 || pointsToRedeem === 500) {
      this.store.dispatch(UserActions.updateUserPoints({
        id: userId,
        points: pointsToRedeem
      }));
    }
  }
}
