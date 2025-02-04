import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../../core/services/auth.service';


@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent implements OnInit {
  currentUser: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user: any) => { // Explicitly typed user
      this.currentUser = user;
    });
  }
}
