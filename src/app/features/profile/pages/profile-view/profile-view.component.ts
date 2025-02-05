import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {User} from '../../../../models/user.model';
import * as UserActions from '../../../../store/user/user.actions';
import * as UserSelectors from '../../../../store/user/user.selectors';



@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent implements OnInit {
  user$: Observable<User | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(private store: Store) {
    this.user$ = this.store.select(UserSelectors.selectUser);
    this.loading$ = this.store.select(UserSelectors.selectUserLoading);
    this.error$ = this.store.select(UserSelectors.selectUserError);
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUser());
  }
}
